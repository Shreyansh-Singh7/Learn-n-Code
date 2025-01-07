using System;
 
class Program
{
    static void Main(string[] args)
    {
        var inputParameters = ReadInputParameters();
        var numbers = ReadNumbers(inputParameters[0]);
        var prefixSums = CalculatePrefixSums(numbers);
 
        for (var i = 0; i < inputParameters[1]; i++)
        {
            var range = ReadRange();
            int average = CalculateAverage(prefixSums, range);
            Console.WriteLine(average);
        }
    }
 
    private static int[] ReadInputParameters()
    {
        return Array.ConvertAll(Console.ReadLine().Split(' '), int.Parse);
    }
 
    private static int[] ReadNumbers(int count)
    {
        return Array.ConvertAll(Console.ReadLine().Split(' '), int.Parse);
    }
 
    private static int[] CalculatePrefixSums(int[] numbers)
    {
        int[] prefixSums = new int[numbers.Length + 1];
        for (int i = 1; i <= numbers.Length; i++)
        {
            prefixSums[i] = prefixSums[i - 1] + numbers[i - 1];
        }
        return prefixSums;
    }
 
    private static int[] ReadRange()
    {
        return Array.ConvertAll(Console.ReadLine().Split(' '), int.Parse);
    }
 
    private static int CalculateAverage(int[] prefixSums, int[] range)
    {
        int sum = prefixSums[range[1]] - prefixSums[range[0] - 1];
        int count = range[1] - range[0] + 1;
        return sum / count;
    }
}