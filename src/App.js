import { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, hasMore, books } = useBookSearch(query, pageNumber);


  const observer = useRef();
  const lastBookElementRef= useCallback(node=>{
    //While loading you shouldn't make calls, else runs into infinite loop
    if(loading) return;
    //Disconnect the previous observer
      if(observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries =>{
        //only have one node, the last element
        //isIntersecting tells whether the node is on the page somewhere
        if(entries[0].isIntersecting && hasMore){
          setPageNumber(pageNumber => pageNumber + 1)
        }
      })
      if(node) observer.current.observe(node)
  },[loading, hasMore])

  const handleInput = e => {
    setQuery(e.target.value);
    setPageNumber(1);
  }
  

  return (
    <>
      <input type="text" value={query} onChange={handleInput}></input>
      {
        books.map((book,index) => {
          if(books.length === index+1){
           return <div ref={lastBookElementRef} key={book}>{book}</div>
          }else{
           return <div key={book}>{book}</div>
          }
        })
      }
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  );
}

export default App;
