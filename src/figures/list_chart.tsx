interface Region {
    Region: string;
    Unemployed: number;
}

interface DataObject {
    Largest: Region[];
    Smallest: Region[];
}

// Define the props for the RegionListItem component
interface RegionListItemProps {
    region: Region; // Type the region prop
    index: number;  // Type the index prop
}

const RegionListItem = ({ region, index }: RegionListItemProps) => {
    const regionName = region.Region || 'Unknown Region';
    const unemployedCount = region.Unemployed !== undefined ? region.Unemployed : 'N/A';

    return (
        <li className="flex items-center justify-between p-4 border-b last:border-b-0">
            <div className="text-4xl font-thin opacity-30 tabular-nums">{String(index + 1).padStart(2, '0')}</div>
            <div className="flex-grow">
                <div>{regionName}</div>
                <div className="text-xs uppercase font-semibold opacity-60">Unemployed: {unemployedCount}</div>
            </div>
        </li>
    );
};

export function RegionList({ data_object }: { data_object: DataObject }) {
    return (
        <div className="flex flex-col space-y-4">
            <ul className="list bg-base-100 rounded-box m-2">
                <li className="p-4 pb-2 text-lg opacity-60 tracking-wide">Largest Regions</li>
                {data_object.Largest.map((region, index) => (
                    <RegionListItem key={index} region={region} index={index} />
                ))}
            </ul>

            <ul className="list bg-base-100 rounded-box m-2">
                <li className="p-4 pb-2 text-lg opacity-60 tracking-wide">Smallest Regions</li>
                {data_object.Smallest.map((region, index) => (
                    <RegionListItem key={index} region={region} index={index} />
                ))}
            </ul>
        </div>
    );
}