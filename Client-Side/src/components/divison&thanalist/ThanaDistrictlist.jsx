import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import divisionsData from './Division-city-thana.json';

const ThanaDistrictlist = ({ initialValues, onChange }) => {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);

  // Load all divisions from JSON
  useEffect(() => {
    if (divisionsData?.divisions) {
      setDivisions(divisionsData.divisions);
    }
  }, []);

  // Set initial values (when editing profile)
  useEffect(() => {
    if (initialValues?.division && divisions.length > 0) {
      const divisionObj = divisions.find((d) => d.division === initialValues.division);
      setSelectedDivision(divisionObj);

      const districtObj = divisionObj?.districts?.find((d) => d.district === initialValues.district);
      setSelectedDistrict(districtObj);

      const thanaObj = districtObj?.stations?.find((s) => s.label === initialValues.policeStation);
      setSelectedThana(thanaObj ? { value: thanaObj.value, label: thanaObj.label } : null);
    }
  }, [divisions, initialValues]);

  const handleDivisionChange = (option) => {
    const division = divisions.find((d) => d.division === option?.value);
    setSelectedDivision(division);
    setSelectedDistrict(null);
    setSelectedThana(null);

    onChange({
      division: division?.division || '',
      district: '',
      policeStation: ''
    });
  };

  const handleDistrictChange = (option) => {
    const district = selectedDivision?.districts?.find((d) => d.district === option?.value);
    setSelectedDistrict(district);
    setSelectedThana(null);

    onChange({
      division: selectedDivision?.division || '',
      district: district?.district || '',
      policeStation: ''
    });
  };

  const handleThanaChange = (option) => {
    setSelectedThana(option);

    onChange({
      division: selectedDivision?.division || '',
      district: selectedDistrict?.district || '',
      policeStation: option?.label || ''
    });
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '44px',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    }),
  };

  return (
    <div>
      <Select
        styles={customStyles}
        className="mb-3"
        placeholder="Select Division"
        options={divisions.map((d) => ({ value: d.division, label: d.division }))}
        value={selectedDivision ? { value: selectedDivision.division, label: selectedDivision.division } : null}
        onChange={handleDivisionChange}
        isClearable
      />

      <Select
        styles={customStyles}
        className="mb-3"
        placeholder="Select District"
        options={selectedDivision?.districts?.map((d) => ({ value: d.district, label: d.district })) || []}
        value={selectedDistrict ? { value: selectedDistrict.district, label: selectedDistrict.district } : null}
        onChange={handleDistrictChange}
        isClearable
        isDisabled={!selectedDivision}
      />

      <Select
        styles={customStyles}
        placeholder="Select Thana"
        options={selectedDistrict?.stations?.map((s) => ({ value: s.value, label: s.label })) || []}
        value={selectedThana}
        onChange={handleThanaChange}
        isClearable
        isDisabled={!selectedDistrict}
      />
    </div>
  );
};

export default ThanaDistrictlist;
