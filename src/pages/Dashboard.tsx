import { useState, useEffect } from 'react';
import { Tabs } from '../Tabs';
import { BarComponent } from '@/figures/bar_chart';
import { MetricChart } from '@/figures/metrics_chart';
import { RegionList } from '@/figures/list_chart';

export default function Dashboard() {
    const [data, setData] = useState<string[]>([]);
    const [currentTab, setCurrentTab] = useState<string>("");
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/dashboard");
                if (!response.ok) throw new Error("Network response was not ok");
                const fetchedData = await response.json();
                setData(fetchedData);
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
                setError("Failed to fetch initial data.");
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentTab) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:5000/dashboard/${currentTab}`);
                if (!response.ok) throw new Error("Error fetching user data");
                
                const jsonData = await response.json();
                setUserData(jsonData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentTab]);

    return (
        <>
            <Tabs array={data} onTabChange={setCurrentTab} />
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {userData && (
<div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
    <div className='flex flex-col justify-between m-2 '>
        <div className='flex-grow mt-2' >
            <BarComponent data={userData.time} />
        </div>
        <div className='flex-grow '>
            <MetricChart data={userData.metrics} />
        </div>
    </div>
    <div className='flex-grow m-2'>
        <RegionList data_object={userData.performance} />
    </div>
</div>
            )}
        </>
    );
}