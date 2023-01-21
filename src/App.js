import React, { useReducer, useEffect } from 'react';
import './style.css';
import { cards, tasks } from './data.json';

const initialState = {
  cards: [],
  tasks: [],
};

export default function App() {
  const [data, setData] = useReducer((prev, next) => {
    return { ...prev, ...next };
  }, initialState);

  useEffect(() => {
    setData({ cards, tasks });
  }, []);

  const { cards: cardList, tasks: taskList } = data;

  const onDrag = (cardIndex) => (event) => {
    try {
      // filter the dragged card
      const draggedCard = taskList.splice(cardIndex, 1)[0];

      // transfer the dragged card data to onDrop handler
      event.dataTransfer.setData(
        'item',
        JSON.stringify({ draggedCard, cardIndex })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onDrop = (columnIndex, droppedCardIndex) => (event) => {
    event.stopPropagation();
    try {
      const taskData = [...taskList];

      // get the data from the onDrag handler
      const { draggedCard, cardIndex } = JSON.parse(
        event.dataTransfer.getData('item')
      );

      // modify the parentId of the transferred data to the dropped column id and also sort the list
      if (droppedCardIndex >= 0 && cardIndex >= 0) {
        if (draggedCard.parentId !== columnIndex) {
          taskData.splice(droppedCardIndex, 0, {
            ...draggedCard,
            parentId: columnIndex,
          });
        } else {
          taskData.splice(droppedCardIndex, 0, draggedCard);
        }
      } else {
        // else modify the parentId of the transferred data to the dropped column id
        taskData.splice(cardIndex, 0, {
          ...draggedCard,
          parentId: columnIndex,
        });
      }

      // set the modified data to the state to render the changes on UI
      setData({ tasks: taskData });
    } catch (error) {
      console.log(error);
    }
  };

  // prevent the default event to allow the items to drop
  const onDragOver = (event) => event.preventDefault();

  return (
    <div className="container">
      {cardList?.map(({ id: cardId, heading: cardTitle }) => {
        return (
          <div
            onDragOver={onDragOver}
            onDrop={onDrop(cardId)}
            key={cardId}
            className="card-container"
          >
            <h3 className="heading">{cardTitle}</h3>
            <div className="card-inner-container">
              {taskList?.map(
                ({ title: taskTitle, id, parentId }, cardIndex) => {
                  return (
                    parentId === cardId && (
                      <section
                        key={id}
                        data-id={cardIndex}
                        draggable
                        className="card"
                        onDragOver={onDragOver}
                        onDrop={onDrop(cardId, cardIndex)}
                        onDragStart={onDrag(cardIndex)}
                      >
                        {taskTitle}
                      </section>
                    )
                  );
                }
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
