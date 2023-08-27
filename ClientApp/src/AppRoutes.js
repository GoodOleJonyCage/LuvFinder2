import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { HomePage } from "./Pages/HomePage";
import { LoginPage } from "./Pages/LoginPage";
import { RegisterPage } from "./Pages/RegisterPage"
import { ProfilePage } from "./Pages/ProfilePage"
import { EditProfilePage } from "./Pages/EditProfilePage"
import { CreateProfilePage } from "./Pages/CreateProfilePage"
import { LogoutPage } from "./Pages/LogoutPage"
import { SearchPage } from './Pages/SearchPage'
import { UploadPage } from './Pages/UploadPage'
import { ProfileCompleted } from './Pages/ProfileCompleted'
import { EditUploadPage } from './Pages/EditUploadPage'
import { BlogPage } from './Pages/BlogPage'

const AppRoutes = [
    {
        index: true,
        element: <HomePage />
    },
    {
        path: '/home',
        element: <HomePage />
    },
    {
        path: '/counter',
        element: <Counter />
    },
    {
        path: '/fetch-data',
        element: <FetchData />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/editprofile',
        element: <EditProfilePage />
    },
    {
        path: '/viewprofile',
        element: <ProfilePage />
    },
    {
        path: '/createprofile',
        element: <CreateProfilePage />
    },
    {
        path: '/logout',
        element: <LogoutPage />
    },
    {
        path: '/search',
        element: <SearchPage />
    },
    {
        path: '/upload',
        element: <UploadPage />
    },
    {
        path: '/completedprofile',
        element: <ProfileCompleted />
    },
    {
        path: '/editupload',
        element: <EditUploadPage />
    },
    {
        path: '/viewblog',
        element: <BlogPage />
    }
    
    
];

export default AppRoutes;
