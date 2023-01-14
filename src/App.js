import React, { useReducer, useEffect } from 'react';
import './style.css';
import { columns } from './data.json';

const initialState = {
  data: [],
};

export default function App() {
  const [data, setData] = useReducer((prev, next) => {
    return { ...prev, ...next };
  }, initialState);

  useEffect(() => {
    setData({ data: columns });
  }, []);

  let datas = [];
  const onDrag = (key) => (event) => {
    const uid = parseInt(event.target.dataset?.id, 10);

    // search the column, which the onDragStart is fired then remove & transfer the matched id card data to onDrop receiver
    const filteredData = data?.data?.[key].data.filter((key) => {
      if (key.id === uid) {
        event.dataTransfer.setData('item', JSON.stringify(key));
        return null;
      }
      return key;
    });

    datas = data?.data?.map((item, idx) => {
      if (key === idx) {
        return {
          ...item,
          data: filteredData,
        };
      }
      return item;
    });
  };

  const onDrop = (key) => (event) => {
    const transferredData = JSON.parse(event.dataTransfer.getData('item'));

    const filter = datas?.map((item, idx) => {
      // search the dropped column & add the received data from parent to the array
      if (idx === key) {
        return {
          ...item,
          data: [...item.data, transferredData],
        };
      }
      return item;
    });
    setData({ data: filter });
  };

  const onDragOver = (event) => event.preventDefault();

  return (
    <div className="container">
      {data?.data?.map((item, index) => {
        return (
          <div
            onDragOver={onDragOver}
            onDrop={onDrop(index)}
            key={index}
            className="card-container"
          >
            <h3 className="heading">{item.heading}</h3>
            {item.data.map(({ title, id }) => (
              <section
                draggable
                onDragOver={onDragOver}
                onDragStart={onDrag(index)}
                className="card"
                key={id}
                data-id={id}
              >
                {title}
              </section>
            ))}
          </div>
        );
      })}
    </div>
  );
}
