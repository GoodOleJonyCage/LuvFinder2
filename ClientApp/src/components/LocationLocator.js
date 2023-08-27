import { useEffect, useState } from 'react'
import { LoadingDiv } from './LoadingDiv'
import { LoadCountries, LoadRegions, LoadCitiesByName } from '../Services/Services'
import { Autocomplete, TextField } from '@mui/material';

export const LocationLocator = (props) => {

        //states for country, region and cities
        const [countries, setcountries] = useState([]);
        const [regions, setregions] = useState([]);
        const [cities, setcities] = useState([]);
        //states for country, region and cities

        //country, region and city helper methods
        const loadCountryList = async () => {
            let countrylist = await LoadCountries();
            setcountries(countrylist);
            
        }
        const loadRegionsList = async (countryid) => {
            let regionList = await LoadRegions(countryid);
            setregions(regionList);
        }
         
        const getSelectedCountry = () => {
            const item = countries.find((opt) => {
                if (opt.id === props.info.countryID) {
                    return opt;
                }
            })
            return item || {};

        }
        const getSelectedRegion = () => {
            const item = regions.find((opt) => {
                if (opt.id === props.info.regionID) {
                    return opt;
                }
            })
            return item || {};

        }
        const getSelectedCity = () => {
            const item = {
                id: props.info.cityID,
                name: props.info.cityName
            }
            return item || {};
        }
        //country, region and city helper methods

        const loadData = async () => {

            try {

                /*load countries, city and regions  */
                loadCountryList();
                if (props.info.countryID > 0)
                    loadRegionsList(props.info.countryID);
                /*load countries, city and regions  */
            } catch (e) {

            }
        }
        useEffect(() => {
            loadData();
        }, []);


        return <>
            <p className="info-name">Address</p>
            <div className="info-details">
                <div className="mb-3 region-container">
                    <div className="first-div">Country</div>
                    <div>
                        {countries.length === 0 ? <LoadingDiv></LoadingDiv> :
                            <Autocomplete
                                disablePortal
                                id="autocom-countries"
                                defaultValue={getSelectedCountry()}
                                onChange={(event, value) => {
                                    if (value) {
                                        props.info.countryID = value.id;
                                        props.info.countryName = value.name;
                                        loadRegionsList(props.info.countryID);
                                    }
                                    else {
                                        props.info.countryID = 0;
                                        props.info.countryName = '';
                                    }
                                }}

                                options={countries}
                                getOptionLabel={(option) => option.name || ""}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField  {...params} label="Country" />}
                            />
                        }
                    </div>
                </div>
                <div className="mb-3 region-container">
                    <div className="first-div">Region</div>
                    <div>
                        {regions.length === 0 ? <div className="highlight-error">Select Country</div> :
                            <Autocomplete
                                disablePortal
                                id="autocom-region"
                                defaultValue={getSelectedRegion()}
                                onChange={(event, value) => {
                                    if (value) {
                                        props.info.regionID = value.id;
                                        props.info.regionName = value.name;
                                       
                                    } else {
                                        props.info.regionID = 0;
                                        props.info.regionName = '';
                                    }
                                    setcities([]);
                                }}
                                options={regions}
                                getOptionLabel={(option) => option.name || ""}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField  {...params} label="Region" />}
                            />
                        }
                    </div>
                </div>
                <div className="mb-3 region-container">
                    <div className="first-div">City</div>
                    <div>
                        {props.info.regionID === 0 ? <div className="highlight-error">Select Region</div> :
                            <Autocomplete
                                disablePortal
                                id="autocom-cities"
                                defaultValue={getSelectedCity()}
                                onChange={(event, value) => {
                                    if (value) {
                                        props.info.cityID = value.id;
                                        props.info.cityName = value.name;
                                    }
                                    else {
                                        props.info.cityID = 0;
                                        props.info.cityName = '';
                                    }
                                }}
                                options={cities}
                                getOptionLabel={(option) => option.name || ""}
                                sx={{ width: 300 }}
                                renderInput={(params) =>
                                    <TextField
                                        onChange={async (event, value) => {
                                            const cities = await LoadCitiesByName(props.info.regionID, event.target.value);
                                            setcities(cities);
                                        }}
                                        {...params} label="City" />}
                            />
                        }
                    </div>
                </div>
            </div>
        </>
 


}