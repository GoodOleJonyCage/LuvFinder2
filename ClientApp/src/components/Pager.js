import {  useState } from 'react'
import { ProfileItem } from './ProfileItem'

export const Pager = (props) => {

    //reference
    //https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-react
    //console.log(props);
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, settodosPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTodos = props.profiles.slice(indexOfFirstItem, indexOfLastItem);

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(props.profiles.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li
                key={number}
                id={number}
                onClick={(e) => { console.log(e.target); setcurrentPage(Number(e.target.id)) }}>
                {number}
            </li>
        );
    });

    return <>
        {
            currentTodos.map((profile, index) => {
            return <ProfileItem profile={profile} key={index} index={index}></ProfileItem>
            })
        }
        <div className="bottom-pager-container">
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>
            <div>
                Page {currentPage}
            </div>
        </div>
      </>

}