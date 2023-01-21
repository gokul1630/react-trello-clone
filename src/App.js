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

  // handle drag event of the each column
  const onDragColumn = (columnIndex) => (event) => {
    // remove the dragged column data & start transfer the dragged column data to onDrop handler
    const draggedCard = cardList.splice(columnIndex, 1)[0];

    event.dataTransfer.setData(
      'item',
      JSON.stringify({ columnIndex, draggedCard })
    );
  };

  const onDrag = (cardIndex) => (event) => {
    event.stopPropagation();
    try {
      // filter the dragged task
      const draggedTask = taskList.splice(cardIndex, 1)[0];

      // transfer the dragged task data to onDrop handler
      event.dataTransfer.setData(
        'item',
        JSON.stringify({ draggedTask, cardIndex })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onDrop =
    (columnId, droppedCardIndex, droppedColumnIndex) => (event) => {
      event.stopPropagation();
      try {
        const taskData = [...taskList];
        const cardData = [...cardList];

        // get the data from the onDrag handler
        const {
          draggedTask,
          cardIndex,
          draggedCard,
          columnIndex: draggedColumnIndex,
        } = JSON.parse(event.dataTransfer.getData('item'));

        // modify the parentId of the transferred data to the dropped column id and also sort the list
        if (droppedCardIndex >= 0 && cardIndex >= 0) {
          if (draggedTask.parentId !== columnId) {
            taskData.splice(droppedCardIndex, 0, {
              ...draggedTask,
              parentId: columnId,
            });
          } else {
            taskData.splice(droppedCardIndex, 0, draggedTask);
          }
        } else if (draggedColumnIndex >= 0) {
          // shift the cards data index accroding to the dropped index
          cardData.splice(droppedColumnIndex, 0, draggedCard);
          setData({ cards: cardData });
        } else {
          // else modify the parentId of the transferred task data to the dropped column id
          taskData.splice(cardIndex, 0, {
            ...draggedTask,
            parentId: columnId,
          });
        }

        // set the modified task data to the state to render the changes on UI
        setData({ tasks: taskData });
      } catch (error) {
        console.log(error);
      }
    };

  // prevent the default event to allow the items to drop
  const onDragOver = (event) => event.preventDefault();

  return (
    <div className="container">
      {cardList?.map(({ id: cardId, heading: cardTitle }, columnIndex) => {
        return (
          <div
            key={cardId}
            draggable
            onDragOver={onDragOver}
            onDrop={onDrop(cardId, null, columnIndex)}
            className="card-container"
            onDragStart={onDragColumn(columnIndex)}
          >
            <h3 className="heading">{cardTitle}</h3>
            <div className="card-inner-container">
              {taskList?.map(
                ({ title: taskTitle, id, parentId }, cardIndex) => {
                  return (
                    parentId === cardId && (
                      <section
                        key={id}
                        draggable
                        className="card"
                        onDragOver={onDragOver}
                        onDrop={onDrop(cardId, cardIndex, columnIndex)}
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
