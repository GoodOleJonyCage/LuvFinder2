import { useEffect, useState } from 'react'
import { GetSearchCritera/*, ExecuteSearch, LoadCountries, LoadRegions, LoadCities, LoadCitiesByName*/ } from '../Services/Services'
import { useNavigate } from 'react-router-dom';
import { LocationLocator } from './LocationLocator'
import { LoadingDiv } from './LoadingDiv'

export const HomePageSearch = () => {

    const [searchcriteria, setsearchcriteria] = useState(null);

    const navigate = useNavigate();

    const loadData = async () => {

        const vm = await GetSearchCritera();
        setsearchcriteria(vm);
        //console.log(vm);
    }
    useEffect(() => {
        loadData();
    }, []);

    return <>
        {
            searchcriteria === null ? <LoadingDiv></LoadingDiv> :
              <form action="/" className="banner-form">
                        <div className="gender">
                            <div className="custom-select right w-100">
                                <select id="user-gender"
                                    defaultValue={searchcriteria.selectedSeekingGender}
                                    onChange={(e) => { searchcriteria.selectedSeekingGender = e.target.value; }}>
                                    <option value={0}>I am a</option>
                                    {
                                        searchcriteria.seekingGenders.map((gender, index) => {
                                            return <option key={index} value={gender.id}>{gender.name}</option>
                                        })
                                    }
                                </select>

                            </div>
                        </div>
                        <div className="person">
                            <div className="custom-select right w-100">
                                <select id="user-gender"
                                    defaultValue={searchcriteria.selectedGender}
                                    onChange={(e) => { searchcriteria.selectedGender = e.target.value }}>
                                    <option value={0}>Looking for a</option>
                                    {
                                        searchcriteria.genders.map((gender, index) => {
                                            return <option key={index} value={gender.id}>{gender.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="age">
                            <div
                                className="right d-flex justify-content-between w-100">
                                <div className="custom-select">
                                    <select id="min-age"
                                        defaultValue={searchcriteria.selectedMinAge}
                                        onChange={(e) => { searchcriteria.selectedMinAge = e.target.value; }}>
                                        <option value={0}>Min Age</option>
                                        {
                                            searchcriteria.minAge.map((age, index) => {
                                                return <option key={index} value={age}>{age}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="custom-select">
                                    <select id="max-age"
                                        defaultValue={searchcriteria.selectedMaxAge}
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
                        <div>
                            <LocationLocator info={searchcriteria}></LocationLocator>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/search',
                                    {
                                        state:
                                        {
                                            searchcriteria: searchcriteria
                                        }
                                    })
                            }}
                            className=""> Find Your Partner</button>
                    </form>
        }
    </>
}