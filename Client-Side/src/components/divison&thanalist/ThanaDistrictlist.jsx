import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import divisionsData from './Division-city-thana.json';

const ThanaDistrictlist = ({ initialValues, onChange, uniqueKey }) => {
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

  // Reset selections when uniqueKey changes (when switching between home/office)
  useEffect(() => {
    setSelectedDivision(null);
    setSelectedDistrict(null);
    setSelectedThana(null);
  }, [uniqueKey]);

  // Set initial values (when editing profile) - improved with uniqueKey dependency
  useEffect(() => {
    if (initialValues?.division && divisions.length > 0) {
      const divisionObj = divisions.find((d) => d.division === initialValues.division);
      setSelectedDivision(divisionObj || null);

      if (divisionObj && initialValues.district) {
        const districtObj = divisionObj.districts?.find((d) => d.district === initialValues.district);
        setSelectedDistrict(districtObj || null);

        if (districtObj && initialValues.policeStation) {
          const thanaObj = districtObj.stations?.find((s) => s.label === initialValues.policeStation);
          setSelectedThana(thanaObj ? { value: thanaObj.value, label: thanaObj.label } : null);
        } else {
          setSelectedThana(null);
        }
      } else {
        setSelectedDistrict(null);
        setSelectedThana(null);
      }
    } else {
      // Reset if no initial values
      setSelectedDivision(null);
      setSelectedDistrict(null);
      setSelectedThana(null);
    }
  }, [divisions, initialValues, uniqueKey]); // Add uniqueKey as dependency

  const handleDivisionChange = (option) => {
    const division = divisions.find((d) => d.division === option?.value);
    setSelectedDivision(division || null);
    setSelectedDistrict(null);
    setSelectedThana(null);

    if (onChange) {
      onChange({
        division: division?.division || '',
        district: '',
        policeStation: ''
      });
    }
  };

  const handleDistrictChange = (option) => {
    const district = selectedDivision?.districts?.find((d) => d.district === option?.value);
    setSelectedDistrict(district || null);
    setSelectedThana(null);

    if (onChange) {
      onChange({
        division: selectedDivision?.division || '',
        district: district?.district || '',
        policeStation: ''
      });
    }
  };

  const handleThanaChange = (option) => {
    setSelectedThana(option);

    if (onChange) {
      onChange({
        division: selectedDivision?.division || '',
        district: selectedDistrict?.district || '',
        policeStation: option?.label || ''
      });
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '44px',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    }),
  };

  return (
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Division</span>
        </label>
        <Select
          styles={customStyles}
          className="mb-3"
          placeholder="Select Division"
          options={divisions.map((d) => ({ value: d.division, label: d.division }))}
          value={selectedDivision ? { value: selectedDivision.division, label: selectedDivision.division } : null}
          onChange={handleDivisionChange}
          isClearable
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">District</span>
        </label>
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
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Thana/Police Station</span>
        </label>
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
    </div>
  );
};

export default ThanaDistrictlist;