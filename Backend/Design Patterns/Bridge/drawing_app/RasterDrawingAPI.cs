using System;

namespace DrawingApp
{
    public class RasterDrawingAPI : IDrawingAPI
    {
        public void DrawCircle(int x, int y, int radius)
        {
            Console.WriteLine($"Drawing a raster circle at ({x},{y}) with radius {radius}");
        }

        public void DrawSquare(int x, int y, int side)
        {
            Console.WriteLine($"Drawing a raster square at ({x},{y}) with side {side}");
        }
    }
}
