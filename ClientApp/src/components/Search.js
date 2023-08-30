import { useEffect, useState } from 'react'
import { GetSearchCritera, ExecuteSearch, LoadCountries, LoadRegions, LoadCities, LoadCitiesByName } from '../Services/Services'
import { LoadingDiv } from './LoadingDiv'
import { ErrorDisplayer } from './ErrorDisplayer'
import { Autocomplete, TextField } from '@mui/material';
import { ProfileItem } from './ProfileItem'
import { Pager } from './Pager'

export const Search = () => {

    const [searchcriteria, setsearchcriteria] = useState(null);
    const [error, seterror] = useState();

    const PerformSearch = async () => {
        try {
            seterror('');
            const newsearchcriteria = await ExecuteSearch(searchcriteria);
            //console.log(newsearchcriteria);
            setsearchcriteria(newsearchcriteria);

        } catch (e) {
            e.json().then(error => {
                seterror(error);
            })
        }
    }

    const loadData = async () => {
        
        const vm = await GetSearchCritera();
        setsearchcriteria(vm);
         //console.log(vm);
    }
    useEffect(() => {
        loadData();
    }, []);

    //elements
    const ProfileList = (props) => {

        return <>
            <div className="member-wrapper">
                <ul className="member-info mb-4">
                    <li className="all-member">
                        <p>Search Count </p>
                        <p>{props.profiles.length}</p>
                    </li>
                    <li className="member-cat">
                        <div className="custom-select right w-100">
                            <select name="member" id="member-cat" className="">
                                <option value="0">Newest Registerd</option>
                                <option value="1">Oldest</option>
                                <option value="2">Popular</option>
                                <option value="3">Most Active</option>
                            </select>
                        </div>
                    </li>
                </ul>
                <div className="row justify-content-start g-3 g-md-4">
                    {
                        props.profiles.length === 0 ? <div className="highlight-error text-center">No profiles to load</div> :
                            <Pager profiles={props.profiles}></Pager>
                            /*props.profiles.map((profile, index) => {*/
                            /*    return <ProfileItem profile={profile} key={index} index={index}></ProfileItem>*/
                            /*})*/
                    }
                    
                </div>
                {/*<div className="paginations">*/}
                {/*    <ul className="lab-ul d-flex flex-wrap justify-content-center mb-1">*/}
                {/*        <li>*/}
                {/*            <a href="/#"><i className="icofont-rounded-double-left"></i></a>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <a href="/#">1</a>*/}
                {/*        </li>*/}
                {/*        <li className="d-none d-sm-block">*/}
                {/*            <a href="/#">2</a>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <a href="/#">...</a>*/}
                {/*        </li>*/}
                {/*        <li className="d-none d-sm-block">*/}
                {/*            <a href="/#">4</a>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <a href="/#">5</a>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <a href="/#"><i className="icofont-rounded-double-right"></i></a>*/}
                {/*        </li>*/}
                {/*    </ul>*/}
                {/*</div>*/}
            </div>
        </>

    }

    const Location = () => {

        const [countries, setcountries] = useState([]);
        const [regions, setregions] = useState([]);
        const [cities, setcities] = useState([]);

        const loadCountryList = async () => {
            let countrylist = await LoadCountries();
            setcountries(countrylist);
            //setregions([]);
            //setcities([]);
        }
        const loadRegionsList = async (countryid) => {
            let regionList = await LoadRegions(countryid);
            setregions(regionList);
            //setcities([]);
        }
        //const loadCitiesList = async (regionid) => {
        //    let cityList = await LoadCities(regionid);
        //    setcities(cityList);
        //}
        const getSelectedCountry = () => {
            const item = countries.find((opt) => {
                if (opt.id === searchcriteria.countryID) {
                    return opt;
                }
            })
            return item || {};

        }
        const getSelectedRegion = () => {
            const item = regions.find((opt) => {
                if (opt.id === searchcriteria.regionID) {

                    return opt;
                }
            })
            return item || {};

        }
        const getSelectedCity = () => {
            //const item = cities.find((opt) => {
            //    if (opt.id === searchcriteria.cityID) {
            //        return opt;
            //    }
            //})
            const item = {
                id : searchcriteria.cityID ,
                name : searchcriteria.cityName 
            }
            return item || {};

        }

        useEffect(() => {
            loadCountryList();
            if (searchcriteria.countryID > 0)
                loadRegionsList(searchcriteria.countryID);
            
        }, []);

        return <>
            <div className="mb-3  region-container">
                {/*<div className="first-div">Country</div>*/}
                <div>
                    {countries.length === 0 ? <LoadingDiv></LoadingDiv> :
                        <Autocomplete
                            className="search-autocomplete"
                            disablePortal
                            defaultValue={getSelectedCountry()}
                            id="autocom-countries"
                            onChange={(event, value) => {
                                if (value) {
                                    searchcriteria.countryID = value.id;
                                    //searchcriteria.countryName = value.name;
                                    loadRegionsList(searchcriteria.countryID);
                                }
                                else {
                                    searchcriteria.countryID = 0;
                                    //info.countryName = '';
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
                {/*<div className="first-div">Region</div>*/}
                <div>
                    {regions.length === 0 ? <div className="highlight-error">Select Country</div> :
                        <Autocomplete
                            disablePortal
                            defaultValue={getSelectedRegion()}
                            id="autocom-region"
                            onChange={(event, value) => {
                                if (value) {
                                    searchcriteria.regionID = value.id;
                                    //searchcriteria.regionName = value.name;
                                    //loadCitiesList(searchcriteria.regionID);
                                } else {
                                    searchcriteria.regionID = 0;
                                    //searchcriteria.regionName = '';
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
               {/* <div className="first-div">City</div>*/}
                <div>
                    {searchcriteria.regionID === 0 ? <div className="highlight-error">Select Region</div> :                       <Autocomplete
                            disablePortal
                            defaultValue={getSelectedCity()}
                            onChange={(event, value) => {
                                if (value) {
                                    searchcriteria.cityID = value.id;
                                    searchcriteria.cityName = value.name;
                                }
                                else {
                                    searchcriteria.cityID = 0;
                                    searchcriteria.cityName = '';
                                }
                            }}
                            id="autocom-cities"
                            options={cities}
                            getOptionLabel={(option) => option.name || ""}
                            sx={{ width: 300 }}
                            renderInput={(params) =>
                                <TextField {...params} label="City"
                                onChange={async(event, value) => {
                                    const cities = await LoadCitiesByName(searchcriteria.regionID, event.target.value);
                                    setcities(cities);
                                }}
                            />}
                        />
                    }
                </div>
            </div>

        </>

    }
    //elements

    return <>
        {
            searchcriteria === null ? <LoadingDiv></LoadingDiv> :
            <section className="member-page-section">
                <div className="container">
                    <div className="member-filter">
                        <div className="member-filter-inner">
                            <div action="/" className="filter-form">
                             <div className="filter-form-fields">
                                <div className="gender">
                                    <div className="custom-select right w-100">
                                        <select id="user-gender" defaultValue={searchcriteria.selectedGender}
                                            onChange={(e) => { searchcriteria.selectedGender = e.target.value}}>
                                            <option value={0}>Search For </option>
                                            {
                                                searchcriteria.genders.map((gender, index) => {
                                                    return <option key={index} value={gender.id}>{gender.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="person">
                                    <div className="custom-select right w-100">
                                            <select id="user-gender" defaultValue={searchcriteria.selectedSeekingGender}
                                                onChange={(e) => { searchcriteria.selectedSeekingGender = e.target.value;}}>
                                                <option value={0}>Seeking</option>
                                                {
                                                    searchcriteria.seekingGenders.map((gender, index) => {
                                                        return <option key={index} value={gender.id}>{gender.name}</option>
                                                    })
                                                }
                                            </select>
                                    </div>
                                </div>
                                <div className="age">
                                    <div className="right d-flex justify-content-between w-100">
                                        <div className="custom-select">
                                                <select id="min-age" defaultValue={searchcriteria.selectedMinAge}
                                                    onChange={(e) => { searchcriteria.selectedMinAge = e.target.value;}}>
                                                    <option value={0}>Min Age</option>
                                                    {
                                                        searchcriteria.minAge.map((age, index) => {
                                                            return <option key={index} value={age}>{age}</option>
                                                        })
                                                    }
                                                </select>
                                        </div>

                                        <div className="custom-select">
                                                <select id="max-age" defaultValue={searchcriteria.selectedMaxAge}
                                                    onChange={(e) => { searchcriteria.selectedMaxAge = e.target.value; }}>
                                                    <option value={0}>Max Age</option>
                                                    {
                                                        searchcriteria.maxAge.map((age, index) => {
                                                            return <option key={index} value={age}>{age}</option>
                                                        })
                                                    }
                                                </select>
                                        </div>
                                    </div>
                                        </div>
                            </div>
                             <div className="">
                                    <div className="search-location-selectors-search">
                                        <Location></Location>
                                    </div>
                            </div>
                             <button onClick={PerformSearch} className="lab-btn" type="submit">Search now <i className="icofont-search-2"></i></button>
                            </div>
                        </div>
                        </div>
                        <ErrorDisplayer error={error}></ErrorDisplayer>
                        <ProfileList profiles={searchcriteria.results}></ProfileList>
                </div>
            </section>
        }
    </>
}