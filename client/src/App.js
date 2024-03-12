import React,{useState,useEffect} from 'react';


import axios from 'axios';
const path = `http://localhost:10000`;

function App() {
  const [items,setItems] = useState([]);
  const [newItem,setNewItem] = useState('');

  const getItems = async ()=>{
    const {data} = await axios.get(`${path}/items`);
    setItems(data);
  }

  const handleNewItemSubmit = async (e)=>{
    await axios.post(`${path}/items`, {
      finished: false,
      description: newItem,
      createTime: new Date().toISOString(),
    });
    setNewItem('');
    getItems();
  }



  const handleItemDelete = async (id)=>{
    await axios.delete(`${path}/items/${id}`);
    getItems();
    //is this refreshing too much?
  }

 


  
  useEffect(()=>{
    getItems();
  },[]);

  return (
    <div>
      <input type='text' value={newItem} onChange={(e)=>setNewItem(e.target.value)} />
      <button onClick={handleNewItemSubmit}>add</button>
      <ul>
        {items.map(item=>(<li key={item.id}>{item.description}<button onClick={()=>handleItemDelete(item.id)}>delete</button></li>))}
      </ul>
    </div>
  );
}

export default App;
