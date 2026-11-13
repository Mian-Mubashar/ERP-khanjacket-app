Add-Type -AssemblyName System.Drawing

$iconsDir = "d:\khanclothe\WarehouseApp\src\assets\icons"
if (!(Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null
}

function Create-Icon {
    param(
        [string]$name,
        [scriptblock]$drawAction
    )
    $bmp = New-Object System.Drawing.Bitmap(64, 64)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 4.0)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    & $drawAction $g $pen

    $targetPath = Join-Path $iconsDir "$name.png"
    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $pen.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $name.png"
}

# 1. Dashboard (LayoutDashboard: 4 grid rectangles)
Create-Icon "dashboard" {
    param($g, $pen)
    # top-left
    $g.DrawRectangle($pen, 10, 10, 18, 22)
    # top-right
    $g.DrawRectangle($pen, 36, 10, 18, 14)
    # bottom-left
    $g.DrawRectangle($pen, 10, 38, 18, 16)
    # bottom-right
    $g.DrawRectangle($pen, 36, 30, 18, 24)
}

# 2. Branches (GitFork)
Create-Icon "branches" {
    param($g, $pen)
    # Top-left circle
    $g.DrawEllipse($pen, 12, 11, 12, 12)
    # Top-right circle
    $g.DrawEllipse($pen, 40, 11, 12, 12)
    # Bottom circle
    $g.DrawEllipse($pen, 26, 41, 12, 12)
    
    # Connecting branches
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddBezier(
        [System.Drawing.PointF]::new(18, 23),
        [System.Drawing.PointF]::new(18, 33),
        [System.Drawing.PointF]::new(32, 33),
        [System.Drawing.PointF]::new(32, 41)
    )
    $g.DrawPath($pen, $path)
    
    $path2 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path2.AddBezier(
        [System.Drawing.PointF]::new(46, 23),
        [System.Drawing.PointF]::new(46, 33),
        [System.Drawing.PointF]::new(32, 33),
        [System.Drawing.PointF]::new(32, 41)
    )
    $g.DrawPath($pen, $path2)
}

# 3. Customers (Users)
Create-Icon "customers" {
    param($g, $pen)
    # Main user head
    $g.DrawEllipse($pen, 16, 12, 16, 16)
    # Main user body
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(8, 34, 32, 28, 180, 180)
    $g.DrawPath($pen, $path)

    # Second user head (behind right)
    $g.DrawArc($pen, 36, 14, 14, 14, -60, 200)
    # Second user body (behind right)
    $path2 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path2.AddArc(28, 36, 28, 26, 270, 90)
    $g.DrawPath($pen, $path2)
}

# 4. Vendors (Building2: commercial factory/headquarters)
Create-Icon "vendors" {
    param($g, $pen)
    # Main building outline
    $g.DrawRectangle($pen, 14, 11, 36, 42)
    # Door
    $g.DrawRectangle($pen, 26, 39, 12, 14)
    # Windows row 1
    $g.DrawLine($pen, 20, 20, 24, 20)
    $g.DrawLine($pen, 40, 20, 44, 20)
    # Windows row 2
    $g.DrawLine($pen, 20, 28, 24, 28)
    $g.DrawLine($pen, 40, 28, 44, 28)
}

# 5. Articles (Shirt: garment article)
Create-Icon "articles" {
    param($g, $pen)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    # Collar V
    $path.AddLine(24, 14, 32, 22)
    $path.AddLine(32, 22, 40, 14)
    # Right shoulder to sleeve
    $path.AddLine(40, 14, 54, 22)
    $path.AddLine(54, 22, 48, 32)
    $path.AddLine(48, 32, 42, 28)
    # Right body side down
    $path.AddLine(42, 28, 42, 50)
    # Bottom hem
    $path.AddLine(42, 50, 22, 50)
    # Left body side up
    $path.AddLine(22, 50, 22, 28)
    # Left sleeve
    $path.AddLine(22, 28, 16, 32)
    $path.AddLine(16, 32, 10, 22)
    $path.AddLine(10, 22, 24, 14)
    $g.DrawPath($pen, $path)
}

# 6. Purchases (Ship: sea freight cargo ship)
Create-Icon "purchases" {
    param($g, $pen)
    # Ocean water lines
    $g.DrawLine($pen, 8, 48, 56, 48)
    $g.DrawLine($pen, 14, 53, 50, 53)
    # Ship hull
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddLine(11, 38, 17, 46)
    $path.AddLine(17, 46, 47, 46)
    $path.AddLine(47, 46, 53, 38)
    $path.AddLine(53, 38, 11, 38)
    $g.DrawPath($pen, $path)
    # Cabin
    $g.DrawRectangle($pen, 22, 24, 18, 14)
    # Chimney
    $g.DrawLine($pen, 35, 17, 35, 24)
}

# 7. Clearance (Anchor: customs port anchor)
Create-Icon "clearance" {
    param($g, $pen)
    # Top ring
    $g.DrawEllipse($pen, 26, 10, 12, 12)
    # Center shaft
    $g.DrawLine($pen, 32, 22, 32, 48)
    # Crossbeam
    $g.DrawLine($pen, 20, 26, 44, 26)
    # Curved bottom flukes
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(14, 26, 36, 26, 0, 180)
    $g.DrawPath($pen, $path)
    # Fluke tips
    $g.DrawLine($pen, 14, 38, 10, 35)
    $g.DrawLine($pen, 50, 38, 54, 35)
}

# 8. Outward (Truck: freight delivery transport)
Create-Icon "outward" {
    param($g, $pen)
    # Cargo box
    $g.DrawRectangle($pen, 10, 17, 28, 22)
    # Front cab
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddLine(38, 25, 48, 25)
    $path.AddLine(48, 25, 54, 32)
    $path.AddLine(54, 32, 54, 39)
    $path.AddLine(54, 39, 38, 39)
    $g.DrawPath($pen, $path)
    # Front windshield
    $g.DrawLine($pen, 48, 25, 48, 32)
    $g.DrawLine($pen, 48, 32, 53, 32)
    # Left wheel
    $g.DrawEllipse($pen, 17, 37, 10, 10)
    # Right wheel
    $g.DrawEllipse($pen, 43, 37, 10, 10)
}

# 9. Payment Collection (ReceiptText: invoice receipt)
Create-Icon "ugrahi" {
    param($g, $pen)
    # Receipt paper
    $g.DrawRectangle($pen, 16, 11, 32, 42)
    # Lines on receipt
    $g.DrawLine($pen, 22, 20, 42, 20)
    $g.DrawLine($pen, 22, 27, 34, 27)
    $g.DrawLine($pen, 22, 34, 42, 34)
    $g.DrawLine($pen, 22, 41, 30, 41)
}

# 10. Reports (BarChart3: analytics chart)
Create-Icon "reports" {
    param($g, $pen)
    # Baseline
    $g.DrawLine($pen, 10, 52, 54, 52)
    # Bar 1 (left)
    $g.DrawLine($pen, 18, 36, 18, 52)
    # Bar 2 (center, tallest)
    $g.DrawLine($pen, 32, 16, 32, 52)
    # Bar 3 (right)
    $g.DrawLine($pen, 46, 26, 46, 52)
}

# 11. Announcements (Bell: notification alert bell)
Create-Icon "announcements" {
    param($g, $pen)
    # Top knob
    $g.DrawLine($pen, 32, 10, 32, 13)
    # Bell dome
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(20, 13, 24, 24, 180, 180)
    $path.AddLine(44, 25, 48, 42)
    $path.AddLine(48, 42, 16, 42)
    $path.AddLine(16, 42, 20, 25)
    $g.DrawPath($pen, $path)
    # Clapper
    $g.DrawArc($pen, 28, 42, 8, 8, 0, 180)
}

# 12. Security (ShieldCheck: security shield with checkmark)
Create-Icon "security" {
    param($g, $pen)
    # Shield shape
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddLine(16, 16, 48, 16)
    $path.AddBezier(
        [System.Drawing.PointF]::new(48, 16),
        [System.Drawing.PointF]::new(48, 34),
        [System.Drawing.PointF]::new(38, 47),
        [System.Drawing.PointF]::new(32, 52)
    )
    $path.AddBezier(
        [System.Drawing.PointF]::new(32, 52),
        [System.Drawing.PointF]::new(26, 47),
        [System.Drawing.PointF]::new(16, 34),
        [System.Drawing.PointF]::new(16, 16)
    )
    $g.DrawPath($pen, $path)
    # Checkmark inside
    $g.DrawLine($pen, 25, 31, 29, 36)
    $g.DrawLine($pen, 29, 36, 39, 26)
}

# 13. Profile (User: user avatar)
Create-Icon "profile" {
    param($g, $pen)
    # Head
    $g.DrawEllipse($pen, 23, 13, 18, 18)
    # Shoulder/body
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(13, 33, 38, 34, 180, 180)
    $g.DrawPath($pen, $path)
}

Write-Host "ALL 13 ICONS GENERATED SUCCESSFULLY IN $iconsDir"

