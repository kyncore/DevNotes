using System;

namespace DrawingApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Shape[] shapes = new Shape[]
            {
                new Circle(1, 2, 3, new VectorDrawingAPI()),
                new Square(5, 7, 11, new RasterDrawingAPI())
            };

            foreach (Shape shape in shapes)
            {
                shape.Draw();
            }
        }
    }
}
