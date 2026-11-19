import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { MetricCard } from '../components/MetricCard';
import { mobileApi, ClearanceBill, ClearancePaymentEntry } from '../services/api';
import { formatCurrency } from '../utils/formatters';

type ClearanceTab = 'BILLS' | 'AGENTS_KHATA';
type StatusFilter = 'ALL' | 'DUE' | 'PAID';

export const ClearanceScreen: React.FC = () => {
  const { theme } = useTheme();

  // Data State
  const [bills, setBills] = useState<ClearanceBill[]>(() => mobileApi.getClearancesSync());
  const [activeTab, setActiveTab] = useState<ClearanceTab>('BILLS');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [selectedBillForDetails, setSelectedBillForDetails] = useState<ClearanceBill | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<ClearanceBill | null>(null);
  const [selectedAgentForKhata, setSelectedAgentForKhata] = useState<any | null>(null);

  // Payment Form State
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'Cash' | 'Online Bank' | 'Cheque'>('Cash');
  const [payNotes, setPayNotes] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  const loadData = async () => {
    try {
      const data = await mobileApi.getClearances();
      setBills(data);
    } catch {
      // Retain state
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Metrics for top cards
  const totalClearanceBillsSum = bills.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const totalPaidSum = bills.reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0);
  const totalBalanceDueSum = bills.reduce((sum, b) => sum + (Number(b.remainingDue) || 0), 0);

  // Grouped Clearing Agents for Khata Tab
  const agentKhataList = useMemo(() => {
    const map = new Map<string, {
      agentName: string;
      billsCount: number;
      totalDuty: number;
      totalPaid: number;
      remainingDue: number;
      containers: string[];
      payments: ClearancePaymentEntry[];
      latestBill: ClearanceBill;
    }>();

    bills.forEach((b) => {
      const name = (b.clearingAgent || 'Direct Customs Clearance').trim();
      const existing = map.get(name);
      const bDuty = Number(b.totalAmount) || 0;
      const bPaid = Number(b.paidAmount) || 0;
      const bDue = Number(b.remainingDue) || 0;
      const bPayments = b.payments || [];

      if (!existing) {
        map.set(name, {
          agentName: name,
          billsCount: 1,
          totalDuty: bDuty,
          totalPaid: bPaid,
          remainingDue: bDue,
          containers: b.containerNo ? [b.containerNo] : [],
          payments: [...bPayments],
          latestBill: b,
        });
      } else {
        existing.billsCount += 1;
        existing.totalDuty += bDuty;
        existing.totalPaid += bPaid;
        existing.remainingDue += bDue;
        if (b.containerNo && !existing.containers.includes(b.containerNo)) {
          existing.containers.push(b.containerNo);
        }
        existing.payments = [...existing.payments, ...bPayments];
      }
    });

    return Array.from(map.values()).sort((a, b) => b.remainingDue - a.remainingDue);
  }, [bills]);

  // Filtered Bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (statusFilter === 'DUE' && b.remainingDue <= 0) return false;
      if (statusFilter === 'PAID' && b.remainingDue > 0) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const str = `${b.billNo} ${b.clearingAgent} ${b.containerNo} ${b.port} ${b.gdNo || ''} ${b.blNo || ''}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [bills, statusFilter, search]);

  // Filtered Agents Khata
  const filteredAgents = useMemo(() => {
    return agentKhataList.filter((a) => {
      if (statusFilter === 'DUE' && a.remainingDue <= 0) return false;
      if (statusFilter === 'PAID' && a.remainingDue > 0) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const str = `${a.agentName} ${a.containers.join(' ')}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [agentKhataList, statusFilter, search]);

  // Open Record Payment Modal
  const handleOpenPaymentModal = (bill: ClearanceBill) => {
    setSelectedBillForPayment(bill);
    setPayAmount(String(bill.remainingDue > 0 ? bill.remainingDue : 50000));
    setPayMethod('Cash');
    setPayNotes(`Payment installment for ${bill.billNo}`);
  };

  // Submit Clearance Payment
  const handleSubmitPayment = async () => {
    if (!selectedBillForPayment) return;
    const amt = Number(payAmount) || 0;
    if (amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }

    try {
      setIsSubmittingPay(true);
      const res = await mobileApi.recordClearancePayment(
        selectedBillForPayment.id,
        amt,
        payMethod,
        payNotes
      );
      if (res.success && res.updated) {
        setBills((prev) =>
          prev.map((b) => (b.id === res.updated!.id ? res.updated! : b))
        );
        setSelectedBillForPayment(null);
        Alert.alert('Payment Recorded', `Rs. ${amt.toLocaleString()} paid successfully to ${selectedBillForPayment.clearingAgent}.`);
      }
    } catch {
      Alert.alert('Error', 'Could not record clearance payment.');
    } finally {
      setIsSubmittingPay(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={activeTab === 'BILLS' ? filteredBills : (filteredAgents as any)}
        keyExtractor={(item: any) => String(item.id || item.agentName)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Header Hero Banner */}
            <View
              style={[
                styles.headerCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.headerPre, { color: theme.brandBlue }]}>
                    CUSTOMS & LOGISTICS
                  </Text>
                  <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                    Khan Traders Clearance
                  </Text>
                  <Text style={[styles.headerDesc, { color: theme.textSecondary }]}>
                    Barca Traders / Clearing agents duty breakdown, DryPort, railway, crane, and logistics vouchers.
                  </Text>
                </View>
                <View style={[styles.dutyPill, { backgroundColor: theme.brandBlueLight, borderColor: theme.brandBlueBorder }]}>
                  <Text style={[styles.dutyPillText, { color: theme.brandBlue }]}>
                    {bills.length} Duty Invoices
                  </Text>
                </View>
              </View>
            </View>

            {/* 3 TOP METRIC CARDS (1 line me 1 box - Spacious for large amounts) */}
            <View style={styles.metricsWrapper}>
              <MetricCard
                title="TOTAL CLEARANCE BILLS"
                value={formatCurrency(totalClearanceBillsSum)}
                subtitle={`Customs Duty + Port & Agency (${bills.length} Bills)`}
                icon="⚓"
                variant="blue"
              />

              <MetricCard
                title="PAID TO AGENTS"
                value={formatCurrency(totalPaidSum)}
                subtitle="Recorded payment installments to clearing agents"
                icon="✓"
                variant="green"
              />

              <MetricCard
                title="OUTSTANDING BALANCE DUE"
                value={formatCurrency(totalBalanceDueSum)}
                subtitle="Clearing agent balance payable"
                icon="⚠️"
                variant="red"
                actionLabel="Record Adaigi →"
                onPressAction={() => {
                  const firstDue = bills.find((b) => b.remainingDue > 0) || bills[0];
                  if (firstDue) handleOpenPaymentModal(firstDue);
                }}
              />
            </View>

            {/* Sub-Tabs: Duty Bills vs Clearing Agents & Khata */}
            <View
              style={[
                styles.tabBarCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.tabToggleRow}>
                <Pressable
                  onPress={() => setActiveTab('BILLS')}
                  style={[
                    styles.tabToggleBtn,
                    activeTab === 'BILLS' && {
                      backgroundColor: theme.brandBlue,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabToggleText,
                      { color: activeTab === 'BILLS' ? '#fff' : theme.textSecondary },
                    ]}
                  >
                    📄 Duty & Clearance Bills ({bills.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab('AGENTS_KHATA')}
                  style={[
                    styles.tabToggleBtn,
                    activeTab === 'AGENTS_KHATA' && {
                      backgroundColor: theme.brandBlue,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabToggleText,
                      { color: activeTab === 'AGENTS_KHATA' ? '#fff' : theme.textSecondary },
                    ]}
                  >
                    📒 Clearing Agents & Khata ({agentKhataList.length})
                  </Text>
                </Pressable>
              </View>

              {/* Status Filter Chips */}
              <View style={styles.statusFilterRow}>
                {(['ALL', 'DUE', 'PAID'] as StatusFilter[]).map((sf) => (
                  <Pressable
                    key={sf}
                    onPress={() => setStatusFilter(sf)}
                    style={[
                      styles.filterChip,
                      statusFilter === sf
                        ? { backgroundColor: theme.brandBlueLight, borderColor: theme.brandBlue }
                        : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: statusFilter === sf ? theme.brandBlue : theme.textSecondary,
                          fontWeight: statusFilter === sf ? '700' : '500',
                        },
                      ]}
                    >
                      {sf === 'ALL' ? 'All Invoices' : sf === 'DUE' ? '🔴 Pending Due' : '🟢 Fully Cleared'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Search Row */}
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 13, marginRight: 6 }}>🔍</Text>
                <TextInput
                  placeholder="Search invoice #, clearing agent, container, GD #..."
                  placeholderTextColor="#94a3b8"
                  value={search}
                  onChangeText={setSearch}
                  style={[styles.searchInput, { color: theme.textPrimary }]}
                />
                {search ? (
                  <Pressable onPress={() => setSearch('')} hitSlop={6}>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>✕</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* List Header Count */}
            <View style={styles.listHeaderRow}>
              <Text style={[styles.listHeaderLabel, { color: theme.textMuted }]}>
                {activeTab === 'BILLS' ? 'CLEARANCE INVOICES' : 'CLEARING AGENTS KHATA'} ({activeTab === 'BILLS' ? filteredBills.length : filteredAgents.length})
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }: { item: any }) => {
          if (activeTab === 'BILLS') {
            const bill = item as ClearanceBill;
            const hasDue = bill.remainingDue > 0;
            return (
              <View
                style={[
                  styles.billCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                  hasDue && { borderLeftColor: '#f43f5e', borderLeftWidth: 3.5 },
                  !hasDue && { borderLeftColor: '#10b981', borderLeftWidth: 3.5 },
                ]}
              >
                {/* Bill Top */}
                <View style={styles.billHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.billBadgeRow}>
                      <Text style={[styles.billNoBadge, { backgroundColor: theme.brandBlueLight, color: theme.brandBlue }]}>
                        {bill.billNo}
                      </Text>
                      {bill.containerSize && (
                        <View style={[styles.sizePill, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}>
                          <Text style={[styles.sizePillText, { color: theme.textSecondary }]}>
                            {bill.containerSize}
                          </Text>
                        </View>
                      )}
                      <View
                        style={[
                          styles.statusPill,
                          {
                            backgroundColor: hasDue ? '#fff1f2' : '#ecfdf5',
                            borderColor: hasDue ? '#fecdd3' : '#a7f3d0',
                          },
                        ]}
                      >
                        <Text style={[styles.statusText, { color: hasDue ? '#e11d48' : '#059669' }]}>
                          {hasDue ? 'Partial' : 'Paid'}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.agentTitle, { color: theme.textPrimary }]}>
                      {bill.clearingAgent}
                    </Text>
                    {bill.party ? (
                      <Text style={[styles.partyText, { color: theme.textMuted }]} numberOfLines={1}>
                        Party: {bill.party}
                      </Text>
                    ) : null}
                    <Text style={[styles.containerMeta, { color: theme.textSecondary }]}>
                      ⚓ {bill.port} • Container: <Text style={{ fontWeight: '700' }}>{bill.containerNo}</Text>
                    </Text>
                  </View>

                  {/* Financial Due Summary */}
                  <View style={styles.financialCol}>
                    <Text
                      style={[
                        styles.dueAmountText,
                        { color: hasDue ? '#e11d48' : '#059669' },
                      ]}
                    >
                      {hasDue ? formatCurrency(bill.remainingDue) : 'Settled'}
                    </Text>
                    <Text style={[styles.dueLabelText, { color: theme.textMuted }]}>
                      {hasDue ? 'Balance Due' : 'Fully Paid'}
                    </Text>
                    <Text style={[styles.totalDutyText, { color: theme.textSecondary }]}>
                      Total: {formatCurrency(bill.totalAmount)}
                    </Text>
                  </View>
                </View>

                {/* Bill Footer & Quick Actions */}
                <View style={[styles.billFooter, { borderTopColor: theme.border }]}>
                  <View style={styles.paidInfoCol}>
                    <Text style={[styles.paidAmountText, { color: '#059669' }]}>
                      Paid: {formatCurrency(bill.paidAmount)}
                    </Text>
                    <Text style={[styles.dateText, { color: theme.textMuted }]}>
                      Date: {bill.date}
                    </Text>
                  </View>

                  <View style={styles.actionsBtnRow}>
                    <Pressable
                      onPress={() => setSelectedBillForDetails(bill)}
                      style={[styles.smallBtnOutline, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}
                    >
                      <Text style={[styles.smallBtnOutlineText, { color: theme.textPrimary }]}>
                        Duty Breakdown
                      </Text>
                    </Pressable>

                    {hasDue && (
                      <Pressable
                        onPress={() => handleOpenPaymentModal(bill)}
                        style={[styles.smallBtnPrimary, { backgroundColor: '#10b981' }]}
                      >
                        <Text style={styles.smallBtnPrimaryText}>
                          + Adaigi (Pay)
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          } else {
            // AGENTS KHATA TAB
            const agent = item;
            const hasDue = agent.remainingDue > 0;
            return (
              <View
                style={[
                  styles.agentCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                  hasDue && { borderLeftColor: '#f43f5e', borderLeftWidth: 3.5 },
                  !hasDue && { borderLeftColor: '#10b981', borderLeftWidth: 3.5 },
                ]}
              >
                <View style={styles.agentTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.agentMainName, { color: theme.textPrimary }]}>
                      {agent.agentName}
                    </Text>
                    <Text style={[styles.agentSubMeta, { color: theme.textMuted }]}>
                      {agent.billsCount} Duty Invoices • {agent.containers.length} Containers
                    </Text>
                  </View>

                  <View style={styles.agentBalanceCol}>
                    <Text
                      style={[
                        styles.agentDueAmount,
                        { color: hasDue ? '#e11d48' : '#059669' },
                      ]}
                    >
                      {formatCurrency(agent.remainingDue)}
                    </Text>
                    <Text style={[styles.agentDueLabel, { color: theme.textMuted }]}>
                      {hasDue ? 'Payable Due' : 'All Clear'}
                    </Text>
                  </View>
                </View>

                {/* Progress bar of Paid vs Due */}
                <View style={[styles.agentProgressBg, { backgroundColor: theme.surfaceMuted }]}>
                  <View
                    style={[
                      styles.agentProgressBar,
                      {
                        width: `${agent.totalDuty > 0 ? Math.min(100, Math.round((agent.totalPaid / agent.totalDuty) * 100)) : 100}%`,
                        backgroundColor: hasDue ? '#0284c7' : '#10b981',
                      },
                    ]}
                  />
                </View>

                <View style={styles.agentStatsRow}>
                  <Text style={[styles.agentStatItem, { color: theme.textSecondary }]}>
                    Total Duty: <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(agent.totalDuty)}</Text>
                  </Text>
                  <Text style={[styles.agentStatItem, { color: '#059669' }]}>
                    Total Paid: <Text style={{ fontWeight: '700' }}>{formatCurrency(agent.totalPaid)}</Text>
                  </Text>
                </View>

                {/* Action Buttons for Agent Khata */}
                <View style={[styles.agentActionsRow, { borderTopColor: theme.border }]}>
                  <Pressable
                    onPress={() => setSelectedAgentForKhata(agent)}
                    style={[styles.smallBtnOutline, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}
                  >
                    <Text style={[styles.smallBtnOutlineText, { color: theme.textPrimary }]}>
                      View Ledger ({agent.payments.length} Payments)
                    </Text>
                  </Pressable>

                  {hasDue && (
                    <Pressable
                      onPress={() => handleOpenPaymentModal(agent.latestBill)}
                      style={[styles.smallBtnPrimary, { backgroundColor: '#10b981' }]}
                    >
                      <Text style={styles.smallBtnPrimaryText}>
                        + Record Adaigi
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }
        }}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 32 }}>⚓</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              No clearance records found
            </Text>
            <Text style={[styles.emptySub, { color: theme.textMuted }]}>
              Try adjusting your search query or filters.
            </Text>
          </View>
        }
      />

      {/* 1. Duty Breakdown Modal */}
      {selectedBillForDetails && (
        <Modal
          visible={!!selectedBillForDetails}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedBillForDetails(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                    Customs Duty & Expense Breakdown
                  </Text>
                  <Text style={[styles.modalSub, { color: theme.textMuted }]}>
                    {selectedBillForDetails.billNo} • {selectedBillForDetails.clearingAgent}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedBillForDetails(null)} hitSlop={10}>
                  <Text style={{ fontSize: 18, color: theme.textMuted }}>✕</Text>
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>Customs Duty</Text>
                  <Text style={[styles.breakdownVal, { color: theme.textPrimary }]}>{formatCurrency(selectedBillForDetails.customDuty)}</Text>
                </View>
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>Shipping Line Charges</Text>
                  <Text style={[styles.breakdownVal, { color: theme.textPrimary }]}>{formatCurrency(selectedBillForDetails.shippingLineCharges)}</Text>
                </View>
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>Clearance Charges</Text>
                  <Text style={[styles.breakdownVal, { color: theme.textPrimary }]}>{formatCurrency(selectedBillForDetails.clearanceCharges)}</Text>
                </View>
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>DryPort & Railway Expenses</Text>
                  <Text style={[styles.breakdownVal, { color: theme.textPrimary }]}>{formatCurrency(selectedBillForDetails.dryPortExpenses)}</Text>
                </View>
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>Agency Fee</Text>
                  <Text style={[styles.breakdownVal, { color: theme.textPrimary }]}>{formatCurrency(selectedBillForDetails.agencyFee)}</Text>
                </View>
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>Other Expenses (Crane/Labour)</Text>
                  <Text style={[styles.breakdownVal, { color: theme.textPrimary }]}>{formatCurrency(selectedBillForDetails.otherExpenses)}</Text>
                </View>

                {/* Grand Total */}
                <View style={[styles.breakdownTotalRow, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}>
                  <Text style={[styles.breakdownTotalLabel, { color: theme.textPrimary }]}>Grand Total Bill</Text>
                  <Text style={[styles.breakdownTotalVal, { color: theme.brandBlue }]}>{formatCurrency(selectedBillForDetails.totalAmount)}</Text>
                </View>

                <View style={styles.breakdownPaidSummary}>
                  <Text style={{ color: '#059669', fontSize: 12, fontWeight: '700' }}>
                    Paid Installments: {formatCurrency(selectedBillForDetails.paidAmount)}
                  </Text>
                  <Text style={{ color: selectedBillForDetails.remainingDue > 0 ? '#e11d48' : '#059669', fontSize: 12, fontWeight: '700' }}>
                    Remaining Due: {formatCurrency(selectedBillForDetails.remainingDue)}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* 2. Record Clearance Payment (Adaigi) Modal */}
      {selectedBillForPayment && (
        <Modal
          visible={!!selectedBillForPayment}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedBillForPayment(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                    💰 Record Clearance Payment (Adaigi)
                  </Text>
                  <Text style={[styles.modalSub, { color: theme.textMuted }]}>
                    {selectedBillForPayment.clearingAgent} • {selectedBillForPayment.billNo}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedBillForPayment(null)} hitSlop={10}>
                  <Text style={{ fontSize: 18, color: theme.textMuted }}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.formBody}>
                {/* Balance Banner */}
                <View style={[styles.formBalanceBox, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}>
                  <Text style={{ color: '#be123c', fontSize: 11, fontWeight: '600' }}>
                    Current Remaining Due:
                  </Text>
                  <Text style={{ color: '#e11d48', fontSize: 16, fontWeight: '800' }}>
                    {formatCurrency(selectedBillForPayment.remainingDue)}
                  </Text>
                </View>

                {/* Amount Input */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    PAYMENT AMOUNT (RS.) *
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={payAmount}
                    onChangeText={setPayAmount}
                    placeholder="Enter amount in PKR"
                    placeholderTextColor="#94a3b8"
                    style={[
                      styles.fieldInput,
                      {
                        backgroundColor: theme.surfaceMuted,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>

                {/* Payment Method */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    PAYMENT METHOD
                  </Text>
                  <View style={styles.methodRow}>
                    {(['Cash', 'Online Bank', 'Cheque'] as const).map((m) => (
                      <Pressable
                        key={m}
                        onPress={() => setPayMethod(m)}
                        style={[
                          styles.methodChip,
                          payMethod === m
                            ? { backgroundColor: '#10b981', borderColor: '#10b981' }
                            : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.methodChipText,
                            { color: payMethod === m ? '#fff' : theme.textSecondary },
                          ]}
                        >
                          {m}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Notes Input */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    NOTES / VOUCHER REFERENCE
                  </Text>
                  <TextInput
                    value={payNotes}
                    onChangeText={setPayNotes}
                    placeholder="e.g. DryPort token receipt # 440"
                    placeholderTextColor="#94a3b8"
                    style={[
                      styles.fieldInput,
                      {
                        backgroundColor: theme.surfaceMuted,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>

                <Pressable
                  disabled={isSubmittingPay}
                  onPress={handleSubmitPayment}
                  style={[styles.submitPayBtn, { backgroundColor: '#10b981' }]}
                >
                  <Text style={styles.submitPayBtnText}>
                    {isSubmittingPay ? 'Saving Payment...' : '✓ Confirm Adaigi & Update Khata'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 3. Agent Ledger Modal */}
      {selectedAgentForKhata && (
        <Modal
          visible={!!selectedAgentForKhata}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedAgentForKhata(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                    Clearance Khata Ledger
                  </Text>
                  <Text style={[styles.modalSub, { color: theme.textMuted }]}>
                    {selectedAgentForKhata.agentName}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedAgentForKhata(null)} hitSlop={10}>
                  <Text style={{ fontSize: 18, color: theme.textMuted }}>✕</Text>
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                {selectedAgentForKhata.payments.length === 0 ? (
                  <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 20 }}>
                    No payment history recorded for this agent yet.
                  </Text>
                ) : (
                  selectedAgentForKhata.payments.map((p: ClearancePaymentEntry) => (
                    <View
                      key={p.id}
                      style={[
                        styles.ledgerItem,
                        {
                          backgroundColor: theme.surfaceMuted,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.ledgerRef, { color: theme.brandBlue }]}>
                          {p.referenceNo || 'Payment'}
                        </Text>
                        <Text style={[styles.ledgerMethod, { color: theme.textSecondary }]}>
                          {p.paymentMethod} • {p.date}
                        </Text>
                        {p.notes ? (
                          <Text style={[styles.ledgerNotes, { color: theme.textMuted }]}>
                            {p.notes}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.ledgerAmount, { color: '#059669' }]}>
                        {formatCurrency(p.amount)}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerPre: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: 4,
  },
  headerDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  dutyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 8,
  },
  dutyPillText: {
    fontSize: 10,
    fontWeight: '700',
  },

  /* Metrics */
  metricsWrapper: {
    marginBottom: 4,
  },

  /* Sub Tab Bar */
  tabBarCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
  },
  tabToggleBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusFilterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 10.5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },

  /* List Header */
  listHeaderRow: {
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  listHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  /* Bill Card */
  billCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  billNoBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  sizePill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    borderWidth: 1,
  },
  sizePillText: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  agentTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  partyText: {
    fontSize: 10.5,
    marginBottom: 2,
  },
  containerMeta: {
    fontSize: 10.5,
  },
  financialCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  dueAmountText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  dueLabelText: {
    fontSize: 9.5,
    marginBottom: 2,
  },
  totalDutyText: {
    fontSize: 10,
  },
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  paidInfoCol: {
    gap: 1,
  },
  paidAmountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 9.5,
  },
  actionsBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  smallBtnOutline: {
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  smallBtnOutlineText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  smallBtnPrimary: {
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  smallBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Agent Khata Card */
  agentCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  agentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  agentMainName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  agentSubMeta: {
    fontSize: 10.5,
    marginTop: 2,
  },
  agentBalanceCol: {
    alignItems: 'flex-end',
  },
  agentDueAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  agentDueLabel: {
    fontSize: 9.5,
  },
  agentProgressBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 6,
  },
  agentProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  agentStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  agentStatItem: {
    fontSize: 11,
  },
  agentActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },

  /* Empty state */
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11,
    marginTop: 4,
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 8,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  modalScroll: {
    marginTop: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  breakdownLabel: {
    fontSize: 11.5,
  },
  breakdownVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 8,
  },
  breakdownTotalLabel: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  breakdownTotalVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  breakdownPaidSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },

  /* Form */
  formBody: {
    gap: 10,
  },
  formBalanceBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  fieldInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 6,
  },
  methodChip: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  methodChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  submitPayBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  submitPayBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '800',
  },

  /* Ledger */
  ledgerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  ledgerRef: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  ledgerMethod: {
    fontSize: 10.5,
    marginTop: 1,
  },
  ledgerNotes: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
  },
  ledgerAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
});
