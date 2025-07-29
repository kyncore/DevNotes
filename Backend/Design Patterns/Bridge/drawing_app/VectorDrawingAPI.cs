using System;

namespace DrawingApp
{
    public class VectorDrawingAPI : IDrawingAPI
    {
        public void DrawCircle(int x, int y, int radius)
        {
            Console.WriteLine($"Drawing a vector circle at ({x},{y}) with radius {radius}");
        }

        public void DrawSquare(int x, int y, int side)
        {
            Console.WriteLine($"Drawing a vector square at ({x},{y}) with side {side}");
        }
    }
}
