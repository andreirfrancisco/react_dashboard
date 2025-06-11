import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"




interface MetricChartProps {
  data: Record<string, number>; // Adjust the type based on the expected structure of your data
}

export function MetricChart({ data }: MetricChartProps) {
  if (!data || typeof data !== 'object') {
    return <p>No metrics data available.</p>;
  }

  return (
    <>
      <div className='text-center text-lg mt-2 mb-2'>
        Metrics
      </div>
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-1 md:grid-cols-2">
        {Object.entries(data).map(([key, value]) => (
          <Card key={key} className="metric-card ">
            <CardHeader className="relative">
              <CardDescription>{key}</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {value}
              </CardTitle>
              <div className="absolute right-4 top-4"></div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              {/* Optional footer content can go here */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}