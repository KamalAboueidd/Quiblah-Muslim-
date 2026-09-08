Add-Type -AssemblyName PresentationCore, PresentationFramework, WindowsBase

function Generate-PwaIcon([int]$size, [string]$outputPath, [bool]$isMaskable = $false) {
    $visual = New-Object System.Windows.Media.DrawingVisual
    $dc = $visual.RenderOpen()

    # Background gradient
    $pt1 = New-Object System.Windows.Point(0, 0)
    $pt2 = New-Object System.Windows.Point(1, 1)
    $c1 = [System.Windows.Media.Color]::FromRgb(16, 38, 37)
    $c2 = [System.Windows.Media.Color]::FromRgb(31, 95, 93)
    $bgBrush = New-Object System.Windows.Media.LinearGradientBrush($c1, $c2, $pt1, $pt2)
    $rect = New-Object System.Windows.Rect(0, 0, $size, $size)
    $dc.DrawRectangle($bgBrush, $null, $rect)

    # Decorative gold circular halo
    $ringColor = [System.Windows.Media.Color]::FromArgb(40, 197, 168, 89)
    $ringBrush = New-Object System.Windows.Media.SolidColorBrush($ringColor)
    $ringPen = New-Object System.Windows.Media.Pen($ringBrush, ($size * 0.02))
    $center = New-Object System.Windows.Point(($size / 2), ($size / 2))
    $radius = if ($isMaskable) { $size * 0.38 } else { $size * 0.44 }
    $dc.DrawEllipse($null, $ringPen, $center, $radius, $radius)

    # Mosque geometry
    $svgPath = "M400 0c5 0 9.8 2.4 12.8 6.4c34.7 46.3 78.1 74.9 133.5 111.5c0 0 0 0 0 0s0 0 0 0c5.2 3.4 10.5 7 16 10.6c28.9 19.2 45.7 51.7 45.7 86.1c0 28.6-11.3 54.5-29.8 73.4l-356.4 0c-18.4-19-29.8-44.9-29.8-73.4c0-34.4 16.7-66.9 45.7-86.1c5.4-3.6 10.8-7.1 16-10.6c0 0 0 0 0 0s0 0 0 0C309.1 81.3 352.5 52.7 387.2 6.4c3-4 7.8-6.4 12.8-6.4zM288 512l0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-48 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32l416 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-48 0 0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-64 0 0-58c0-19-8.4-37-23-49.2L400 384l-25 20.8C360.4 417 352 435 352 454l0 58-64 0zM70.4 5.2c5.7-4.3 13.5-4.3 19.2 0l16 12C139.8 42.9 160 83.2 160 126l0 2L0 128l0-2C0 83.2 20.2 42.9 54.4 17.2l16-12zM0 160l160 0 0 136.6c-19.1 11.1-32 31.7-32 55.4l0 128c0 9.6 2.1 18.6 5.8 26.8c-6.6 3.4-14 5.2-21.8 5.2l-64 0c-26.5 0-48-21.5-48-48L0 176l0-16z"
    $geom = [System.Windows.Media.Geometry]::Parse($svgPath).Clone()

    # Scale and translate geometry so it fits nicely
    $bounds = $geom.Bounds
    $targetWidth = if ($isMaskable) { $size * 0.50 } else { $size * 0.58 }
    $scale = $targetWidth / $bounds.Width
    $targetHeight = $bounds.Height * $scale

    $offsetX = ($size - $targetWidth) / 2 - ($bounds.Left * $scale)
    $offsetY = ($size - $targetHeight) / 2 - ($bounds.Top * $scale)

    $transformGroup = New-Object System.Windows.Media.TransformGroup
    $scaleTransform = New-Object System.Windows.Media.ScaleTransform($scale, $scale)
    $translateTransform = New-Object System.Windows.Media.TranslateTransform($offsetX, $offsetY)
    $transformGroup.Children.Add($scaleTransform)
    $transformGroup.Children.Add($translateTransform)

    $geom.Transform = $transformGroup

    # Draw gold mosque with soft glow effect
    $goldColor = [System.Windows.Media.Color]::FromRgb(197, 168, 89)
    $goldBrush = New-Object System.Windows.Media.SolidColorBrush($goldColor)
    $dc.DrawGeometry($goldBrush, $null, $geom)

    $dc.Close()

    # Render to bitmap
    $rtb = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($size, $size, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $rtb.Render($visual)

    $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
    $frame = [System.Windows.Media.Imaging.BitmapFrame]::Create($rtb)
    $encoder.Frames.Add($frame)

    $fullPath = [System.IO.Path]::GetFullPath($outputPath)
    $fs = [System.IO.File]::Create($fullPath)
    $encoder.Save($fs)
    $fs.Close()
    Write-Host "Successfully generated: $outputPath ($size x $size)"
}

Generate-PwaIcon 192 "icons\icon-192.png" $false
Generate-PwaIcon 512 "icons\icon-512.png" $false
Generate-PwaIcon 192 "icons\icon-maskable-192.png" $true
Generate-PwaIcon 512 "icons\icon-maskable-512.png" $true
Remove-Item -Path "scratch_generate_icons.ps1" -Force
