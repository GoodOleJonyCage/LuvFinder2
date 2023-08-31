import { useEffect, useState } from 'react'
import { GetSearchCritera/*, ExecuteSearch, LoadCountries, LoadRegions, LoadCities, LoadCitiesByName*/ } from '../Services/Services'
import { useNavigate } from 'react-router-dom';
import { LocationLocator } from './LocationLocator'
import { LoadingDiv } from './LoadingDiv'

export const AsideSearch = () => {

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
                <aside className="mt-5 mt-xl-0">
                    <div className="widget search-widget">
                        <div className="widget-inner">
                            <div className="widget-title">
                                <h5>Filter Search Member</h5>
                            </div>
                            <div className="widget-content">
                                <p>Serious Dating With TuruLav Your Perfect
                                    Match is Just a Click Away.</p>
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
                            </div>
                        </div>
                    </div>

                    <div className="widget like-member">
                        <div className="widget-inner">
                            <div className="widget-title">
                                <h5>you may like</h5>
                            </div>
                            <div className="widget-content">
                                <div className="row row-cols-3 row-cols-sm-auto g-3">
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/01.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/02.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/03.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/04.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/05.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/06.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/07.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/08.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="image-thumb">
                                            <a href="#">
                                                <img src="assets/images/widget/09.jpg"
                                                    alt="img" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="widget active-group">
                        <div className="widget-inner">
                            <div className="widget-title">
                                <h5>join the group</h5>
                            </div>
                            <div className="widget-content">
                                <div className="group-item lab-item">
                                    <div
                                        className="lab-inner d-flex flex-wrap align-items-center">
                                        <div className="lab-content w-100">
                                            <h6>Active Group A1</h6>
                                            <p>Colabors atively fabcate best breed and
                                                apcations through visionary</p>
                                            <ul className="img-stack d-flex">
                                                <li><img src="assets/images/group/group-mem/01.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/02.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/03.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/04.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/05.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/06.png"
                                                    alt="member-img" /></li>
                                                <li className="bg-theme">12+</li>
                                            </ul>
                                            <div className="test"> <a href="profile.html"
                                                className="lab-btn">
                                                <i className="icofont-users-alt-5"></i>
                                                View Group</a></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="group-item lab-item">
                                    <div
                                        className="lab-inner d-flex flex-wrap align-items-center">
                                        <div className="lab-content w-100">
                                            <h6>Active Group A2</h6>
                                            <p>Colabors atively fabcate best breed and
                                                apcations through visionary</p>
                                            <ul className="img-stack d-flex">
                                                <li><img src="assets/images/group/group-mem/01.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/02.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/03.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/04.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/05.png"
                                                    alt="member-img" /></li>
                                                <li><img src="assets/images/group/group-mem/06.png"
                                                    alt="member-img" /></li>
                                                <li className="bg-theme">16+</li>
                                            </ul>
                                            <div className="test"> <a href="profile.html"
                                                className="lab-btn">
                                                <i className="icofont-users-alt-5"></i>
                                                View Group</a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
        }
    </>
}