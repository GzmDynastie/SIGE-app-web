interface SelectProps<T> {
    data: T[];
    option: { key: keyof T; label: keyof T | ((item: T) => string) };
    value?: string | number | undefined;
    text?: string;
    onChange?: (selectedValue: T) => void;
}

const Select = <T,>({ data, option, value, text, onChange }: SelectProps<T>) => {
    return (
        <select
            className="form-select"
            aria-label="Default select example"
            value={value}
            onChange={(e) => {
                const selectedValue = data.find(item => String(item[option.key]) === e.target.value);
                if (selectedValue) onChange?.(selectedValue);
            }}
        >
            {text && (
                <option value="" disabled>{text}</option>
            )}

            {data.map((item, index) => (
                <option key={index} value={String(item[option.key])}>
                    {typeof option.label === "function"
                        ? option.label(item)
                        : String(item[option.label])}
                </option>
            ))}
        </select>
    );
};

export default Select;
