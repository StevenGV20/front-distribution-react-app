import React, { useState, useEffect, useRef } from 'react';

const Autocomplete = ({ apiUrl, inputValue, setInputValue, inputRefAddon,formik }) => {
  
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (inputValue) {
      const fetchOptions = async () => {
        try {
          const response = await fetch(`${apiUrl}?cia=01&cliente=${inputValue}`);
          const data = await response.json();
          setOptions(data);
          setIsOpen(true);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };
      fetchOptions();
    } else {
      setOptions([]);
      setIsOpen(false);
    }
  }, [inputValue, apiUrl]);
  

  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    formik.setFieldValue("pre_cliente",event.target.value)
  };
  
  const handleOptionClick = (option) => {
    setInputValue(option);
    setOptions([]);
    setIsOpen(false);
    formik.setFieldValue("pre_cliente",option)
  };
  

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        name="pre_cliente"
        value={formik.values.pre_cliente}
        onChange={handleInputChange}
        ref={inputRefAddon}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        className={`${
          formik.errors.pre_cliente ? "Mymodal__input-error" : ""
        }`}
      />
      {isOpen && options.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#fff',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: 0,
          margin: 0,
          listStyleType: 'none',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.2)'
        }}>
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option.descripcion)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #ddd',
                backgroundColor: '#fff',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              {option.descripcion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
