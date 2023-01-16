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

  let cards = [...data?.data];
  const onDrag = (columnIndex, cardIndex) => (event) => {
    // search the column, which the onDragStart is fired then remove & transfer the matched id card data to onDrop receiver

    // filter the dragged column
    const filteredColumn = cards[columnIndex];

    // removed the card from the filtered column
    const removedCard = filteredColumn.data?.splice(cardIndex, 1)[0];

    // transfer the removed card data to onDrop handler
    event.dataTransfer.setData('item', JSON.stringify(removedCard));

    // update the array with removed children
    cards?.splice(columnIndex, 1, filteredColumn);
  };

  const onDrop = (columnIndex) => (event) => {
    // search the dropped column & add the received data from parent to the array

    const data = [...cards];

    // get the data from the onDrag handler
    const transferredData = JSON.parse(event.dataTransfer.getData('item'));

    // filter the dropped column
    const filter = data[columnIndex];

    // add the transferred data to the filtered column data array
    const modifiedData = { ...filter, data: [...filter.data, transferredData] };

    // update the modified data to the dropped column
    data.splice(columnIndex, 1, modifiedData);

    // set the modified data to the state to render the changes on UI
    setData({ data });
  };

  // prevent the default event to allow the items to drop
  const onDragOver = (event) => event.preventDefault();

  return (
    <div className="container">
      {data?.data?.map((item, columnIndex) => {
        return (
          <div
            onDragOver={onDragOver}
            onDrop={onDrop(columnIndex)}
            key={columnIndex}
            className="card-container"
          >
            <h3 className="heading">{item.heading}</h3>
            {item.data.map(({ title, id }, cardIndex) => (
              <section
                draggable
                onDragOver={onDragOver}
                onDragStart={onDrag(columnIndex, cardIndex)}
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
