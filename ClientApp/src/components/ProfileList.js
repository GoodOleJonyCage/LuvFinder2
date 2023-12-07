import { useState, useEffect } from 'react'
import { LoadProfiles } from '../Services/Services'
import { LoadingDiv } from './LoadingDiv'
import { UserStore } from './UserStore'
import { ProfileItem } from './ProfileItem'

export const ProfileList = () => {

    const [loaded, setloaded] = useState(false);
    const [profiles, setprofiles] = useState([]);
    const { getUsername } = UserStore();

    const LoadData = async () => {

        try {
            let vm = await LoadProfiles(getUsername());
            setprofiles(vm);
            setloaded(true);
        } catch (e) {

        }
    }
    useEffect(() => {
        LoadData();
    }, []);


    return <div className="row justify-content-center g-3 g-md-4">
        {
            profiles.length === 0 ?
                (loaded ? <div className="highlight-error text-center">No profiles to load</div> : <LoadingDiv></LoadingDiv>) :
                profiles.map((profile, index) => {
                    return <ProfileItem profile={profile} key={index} index={index}></ProfileItem>
                })
        }
    </div>;

}