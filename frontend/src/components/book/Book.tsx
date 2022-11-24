import React, { FC } from "react";
import "./Book.css";

export type BookProps = {
  book: {
    _id: KeyType;
    title: string;
    description: string;
    price: number;
    date: Date;
  };
};

const Book: FC<BookProps> = (props) => {
  return (
    <div key={props.book._id} className="book_wrapper">
      <div className="title_price_date">
        <div className="title">
          Title - <span className="fetchedDataText">{props.book.title}</span>
        </div>
        <hr className="hrInDetail" />
        <div>
          <div>Price - Date</div>
          <span className="fetchedDataText">
            <>
              ${props.book.price} -{" "}
              {new Date(props.book.date).toLocaleDateString()}
            </>
          </span>
        </div>
      </div>
      <div className="description">
        <div> Description</div>
        <hr className="hrInDetail" />
        <div>
          <span className="fetchedDataText descriptiveText">
            {" "}
            {props.book.description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Book;
