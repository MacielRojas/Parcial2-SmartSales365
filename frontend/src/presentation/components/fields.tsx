type TextFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder?:string;
  required?:boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField = ({label, name, value, placeholder, required, onChange}: TextFieldProps) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
        </label>
        <input
            type="text"
            className="form-control"
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
        />
    </div>
);

type NumberFieldProps = {
    label:string;
    name:string;
    value:number;
    min?:number;
    max?:number;
    step?:number;
    required?:boolean;
    onChange:(e: React.ChangeEvent<HTMLInputElement>)=>void;
}

export const NumberField = ({label, name, value, min, max, step, required, onChange}: NumberFieldProps) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
        </label>
        <input 
        type="number"
        className = "form-control"
        id={name}
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        required={required}
        />
    </div>
);

type EmailFieldProps = {
    value:string;
    onChange:(e: React.ChangeEvent<HTMLInputElement>)=>void;
}

export const EmailField = ({value, onChange}: EmailFieldProps) => (
    <div className="mb-3">
        <label htmlFor="email" className="form-label fw-semibold">
            Email
        </label>
        <input 
        type="email"
        className = "form-control"
        id="email"
        name="email"
        value={value}
        placeholder = "usuarios@correo.com"
        onChange={onChange}
        required
        />
    </div>
);

type PasswordFieldProps = {
    value:string;
    onChange:(e: React.ChangeEvent<HTMLInputElement>)=>void;
}

export const PasswordField = ({value, onChange}: PasswordFieldProps) => (
    <div className="mb-3">
        <label htmlFor="password" className="form-label fw-semibold">
            Contraseña
        </label>
        <input 
        type="password"
        className = "form-control"
        id="password"
        name="password"
        value={value}
        onChange={onChange}
        placeholder = "Ingrese su contraseña"
        required
        />
    </div>
);

type SelectFieldProps = {
    label: string;
    name: string;
    value: string;
    options: { label: string; value: string }[];
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField = ({ label, name, value, options, required, onChange }: SelectFieldProps) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
        </label>
        <select
            className="form-select"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
        >
            {value === "" && (
                <option value="" disabled>
                    Seleccione una opción
                </option>
            )}

            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

type TextareaFieldProps = {
    label: string;
    name: string;
    value: string;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextareaField = ({ label, name, value, rows = 3, placeholder, required, onChange }: TextareaFieldProps) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
        </label>
        <textarea
            className="form-control"
            id={name}
            name={name}
            value={value}
            rows={rows}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
        />
    </div>
);

type CheckboxGroupFieldProps = {
  label: string;
  name: string;
  value: string[]; // array de valores seleccionados
  options: { label: string; value: string }[];
  onChange: (name: string, values: string[]) => void;
};

export const CheckboxGroupField = ({ label, name, value, options, onChange }: CheckboxGroupFieldProps) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value: optionValue } = e.target;

    let newValues = [...value];
    if (checked) {
      newValues.push(optionValue);
    } else {
      newValues = newValues.filter(v => v !== optionValue);
    }

    onChange(name, newValues);
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold d-block">{label}</label>
      {options.map(opt => (
        <div className="form-check" key={opt.value}>
          <input
            className="form-check-input"
            type="checkbox"
            id={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            checked={value.includes(opt.value)}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor={`${name}-${opt.value}`}>
            {opt.label}
          </label>
        </div>
      ))}
    </div>
  );
};

type DateFieldProps = {
    label: string;
    name: string;
    value: string;
    min?: string;
    max?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateField = ({ label, name, value, min, max, required, onChange }: DateFieldProps) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
        </label>
        <input
            type="date"
            className="form-control"
            id={name}
            name={name}
            value={value}
            min={min}
            max={max}
            required={required}
            onChange={onChange}
        />
    </div>
);

type FileFieldProps = {
    label: string;
    name: string;
    accept?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileField = ({ label, name, accept, required, onChange }: FileFieldProps) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
        </label>
        <input
            type="file"
            className="form-control"
            id={name}
            name={name}
            accept={accept}
            required={required}
            onChange={onChange}
        />
    </div>
);

type RadioOption = { label: string; value: string; };

type RadioGroupFieldProps = {
    label: string;
    name: string;
    value: string[];
    options: RadioOption[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioGroupField = ({ label, name, value, options, onChange }: RadioGroupFieldProps) => (
    <div className="mb-3">
        <label className="form-label fw-semibold d-block">
            {label}
        </label>
        {options.map(opt => (
            <div className="form-check" key={opt.value}>
                <input
                    className="form-check-input"
                    type="radio"
                    id={`${name}-${opt.value}`}
                    name={name}
                    value={opt.value}
                    checked={value.includes(opt.value)}
                    onChange={onChange}
                />
                <label className="form-check-label" htmlFor={`${name}-${opt.value}`}>
                    {opt.label}
                </label>
            </div>
        ))}
    </div>
);

type PhoneFieldProps = {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneField = ({ label, name, value, placeholder, required, onChange }: PhoneFieldProps) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
        </label>
        <input
            type="tel"
            className="form-control"
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
        />
    </div>
);