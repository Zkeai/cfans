import { NextResponse } from "next/server";

export async function GET() {
    const url = "https://www.okx.com/priapi/v3/growth/convert/currency-pair-market-movement";
    const params = new URLSearchParams({
        baseCurrency: "USDT",
        quoteCurrency: "CNY",
        bar: "5m",
        limit: "10",
        t: Date.now().toString(),
    });

    try {
        const response = await fetch(`${url}?${params}`);
        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch data: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();

        // Extract prices and calculate average
        const prices = data?.data?.datapointList?.map((item: { price: number }) => item.price) || [];
        if (prices.length === 0) {
            return NextResponse.json({ averagePrice: 0, message: "No data available" });
        }

        const averagePrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;

        return NextResponse.json({ averagePrice });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}