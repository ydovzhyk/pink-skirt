import Select, { components } from 'react-select';
import Text from '../text/text';

const LanguageOption = props => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <span className="inline-flex items-center justify-center w-full">
        <span className="md:hidden">{String(data.code).toUpperCase()}</span>
        <span className="hidden md:inline">{data.lang}</span>
      </span>
    </components.Option>
  );
};

const LanguageSingleValue = props => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <span className="inline-flex items-center justify-center w-full">
        <span className="md:hidden">{String(data.code).toUpperCase()}</span>
        <span className="hidden md:inline">{data.lang}</span>
      </span>
    </components.SingleValue>
  );
};

const SelectField = ({
  name,
  value,
  handleChange,
  placeholder,
  required,
  options,
  defaultValue,
  containerClassName = '',
  topPlaceholder = false,
  textAlign = 'center',
  textColor = 'black',
  isSearchable = true,
  variant = 'default',
}) => {
  const customStyles = {
    container: provided => ({
      ...provided,
      width: '100%',
    }),
    control: (provided, state) => ({
      ...provided,
      outline: 'none',
      cursor: 'pointer',
      height: '35px',
      backgroundColor: 'transparent',
      borderColor: state.isFocused
        ? provided.borderColor
        : 'var(--accent-border)',
      boxShadow: state.isFocused ? 'var(--accent-border)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': { borderColor: 'var(--accent-border)' },
    }),
    singleValue: provided => ({
      ...provided,
      fontSize: '16px',
      fontWeight: 300,
      fontFamily: 'Urbanist',
      color: textColor,
      textAlign: textAlign,
    }),
    input: provided => ({
      ...provided,
      fontSize: '16px',
      fontWeight: 300,
      fontFamily: 'Urbanist',
      color: textColor,
      textAlign: textAlign,
    }),
    placeholder: provided => ({
      ...provided,
      fontSize: '16px',
      fontWeight: 300,
      fontFamily: 'Urbanist',
      color: textColor,
      textAlign: textAlign,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '16px',
      fontWeight: 300,
      fontFamily: 'Urbanist',
      color: 'black',
      backgroundColor: state.isFocused ? 'var(--section-first)' : 'white',
      cursor: 'pointer',
    }),
  };

  const valueId = `select-${name}`;
  const dynamicValue = textAlign === 'center' ? 'center' : 'flex-start';

  const customComponents =
    variant === 'language'
      ? { Option: LanguageOption, SingleValue: LanguageSingleValue }
      : undefined;

  return (
    <label
      className={`relative flex flex-col items-center gap-[0px] ${containerClassName}`}
    >
      {topPlaceholder && (
        <div
          className="absolute top-[-23px] left-0 w-full flex items-center"
          style={{ justifyContent: dynamicValue }}
        >
          <Text
            type="tiny"
            as="p"
            fontWeight="light"
            className={topPlaceholder ? 'text-white' : 'text-black'}
          >
            {placeholder}
          </Text>
        </div>
      )}

      <Select
        id={valueId}
        instanceId={valueId}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        options={options}
        styles={customStyles}
        defaultValue={defaultValue}
        isSearchable={isSearchable}
        components={customComponents}
        getOptionValue={opt => opt.value}
        getOptionLabel={opt => opt.label}
        theme={theme => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary: 'var(--accent-border)',
          },
        })}
      />
    </label>
  );
};

export default SelectField;