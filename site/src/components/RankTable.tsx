'use client';

import IRankDataItem from "../types/IRankDataItem";

function RankTable(props: { data: IRankDataItem[] }) {
    return <div className="overflow-x-auto">
        <table className='table'>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Yards</th>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Race</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.data.map(item => {
                        return <tr key={item.id}>
                            <td>{item.rank}</td>
                            <td>{item.yards}</td>
                            <td>{item.name}</td>
                            <td>{item.natFull}</td>
                            <td>{item.race}</td>
                            <td>{item.date}</td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </div>
}

export default RankTable;