# Uses Windows PowerShell 5.1's built-in System.Drawing implementation.
param([ValidateRange(1, 8)][int]$Scale = 4)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class ResearchImageUpscaler
{
    public static Bitmap Upscale(Bitmap source, int scale)
    {
        var enlarged = new Bitmap(source.Width * scale, source.Height * scale, PixelFormat.Format32bppArgb);
        using (var graphics = Graphics.FromImage(enlarged))
        using (var attributes = new ImageAttributes())
        {
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
            attributes.SetWrapMode(WrapMode.TileFlipXY);
            graphics.DrawImage(source, new Rectangle(0, 0, enlarged.Width, enlarged.Height),
                0, 0, source.Width, source.Height, GraphicsUnit.Pixel, attributes);
        }

        var rectangle = new Rectangle(0, 0, enlarged.Width, enlarged.Height);
        var data = enlarged.LockBits(rectangle, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        try
        {
            var pixels = new byte[data.Stride * data.Height];
            Marshal.Copy(data.Scan0, pixels, 0, pixels.Length);
            var sharpened = (byte[])pixels.Clone();
            // Mild unsharp mask: enhance existing edges without reconstructing text or geometry.
            for (int y = 1; y < data.Height - 1; y++)
            for (int x = 1; x < data.Width - 1; x++)
            for (int channel = 0; channel < 3; channel++)
            {
                int index = y * data.Stride + x * 4 + channel;
                double blurred = (
                    pixels[index - data.Stride - 4] + 2 * pixels[index - data.Stride] + pixels[index - data.Stride + 4] +
                    2 * pixels[index - 4] + 4 * pixels[index] + 2 * pixels[index + 4] +
                    pixels[index + data.Stride - 4] + 2 * pixels[index + data.Stride] + pixels[index + data.Stride + 4]) / 16.0;
                int value = (int)Math.Round(pixels[index] + 0.55 * (pixels[index] - blurred));
                sharpened[index] = (byte)Math.Max(0, Math.Min(255, value));
            }
            Marshal.Copy(sharpened, 0, data.Scan0, sharpened.Length);
        }
        finally { enlarged.UnlockBits(data); }
        return enlarged;
    }
}
'@ -ReferencedAssemblies System.Drawing

$projectRoot = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { (Get-Location).Path }
$sourcePath = Join-Path $projectRoot 'public/images/leeseunglab/research-carbon-ecology.png'
$outputDirectory = Join-Path $projectRoot 'public/images/leeseunglab/research-division-1-upscaled'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

$regions = @(
    @(10,165,275,83), @(265,165,267,83), @(575,165,275,83), @(828,165,267,83),
    @(10,357,275,82), @(265,357,267,82), @(575,356,275,83), @(828,356,267,83),
    @(10,549,275,81), @(265,549,267,81), @(575,549,275,81), @(828,549,267,81)
)
$sourceImage = [System.Drawing.Bitmap]::new($sourcePath)
try {
    foreach ($region in $regions) {
        $rectangle = [System.Drawing.Rectangle]::new($region[0], $region[1], $region[2], $region[3])
        $crop = $sourceImage.Clone($rectangle, $sourceImage.PixelFormat)
        try {
            $upscaledImage = [ResearchImageUpscaler]::Upscale($crop, $Scale)
            try {
                $outputPath = Join-Path $outputDirectory "$($region[0])-$($region[1]).png"
                $upscaledImage.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
                Write-Output "$($region[0])-$($region[1]).png: $($crop.Width)x$($crop.Height) -> $($upscaledImage.Width)x$($upscaledImage.Height)"
            } finally { $upscaledImage.Dispose() }
        } finally { $crop.Dispose() }
    }
} finally { $sourceImage.Dispose() }
