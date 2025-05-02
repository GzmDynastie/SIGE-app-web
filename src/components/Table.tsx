interface TableProps<T> {
    data: T[];
    columns: { key: keyof T; label: string | JSX.Element }[];
}

const Table = <T,>({ data, columns }: TableProps<T>) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered" >
                <thead className="table-dark"> 
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key as string}>{col.label as string | number }</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={col.key as string}>{row[col.key] as string | number}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center">
                                No hay datos disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;