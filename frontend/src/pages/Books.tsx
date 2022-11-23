import { useMachine } from "@xstate/react";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { assign, createMachine } from "xstate";
import Backdrop from "../components/backdrop/Backdrop";
import Modal from "../components/modals/Modal";
import "./Books.css";

const booksMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCMD2qDWsB0sAWqA7gELpYDEqADmAHYCyqEAhgDYDaADALqKhWpYASwAuQ1LT4gAHogBMANgCc2ACzLOAZgCMnLQFYA7PtUAaEAE95nbAA45m1fserDtpatXaFAXx-m0TBxmCAhSTHJYZgA3MHCMLl4kEAFhMQkpWQRtfWwFOVtXJS1tVT1tJXMrBAcFbDlVB0M5fX1OMua-ALJg0PjyAGNmWgGwVgBlGLBEqVTRcUlkrIBaTRscuTd2zlsFXftNKsRNTRV7QwV9JUNVa8NOC79-EFomOClArFnBeYylxGW2haeRy2m0hiUClOnGURwQyz22BOBT0RnyDSMXRAnxw+CI8XgyTm6UWoCymkUSJhBUMmgUNyURjhci0IP0lz0jk2qixOOwITCZG+aQWmQBhkMbLBEKhxVhlkQjTyRlsOlVzkM2k0tiePiAA */
  createMachine(
    {
      context: {
        modalOpen: false,
        addedBook: {},
        books: [],
        showSuccess: false,
        showError: false,
      },
      id: "books",
      initial: "showBooks",
      states: {
        showBooks: {
          on: {
            openModal: {
              target: "addBook",
              actions: "openModal",
            },
            saveBooks: {
              actions: ["saveBooks"],
            },
            reset: {
              actions: ["reset"],
            },
          },
        },
        addBook: {
          on: {
            saveBook: {
              target: "saveBookInDB",
              actions: ["saveBook"],
            },
            cancelSave: {
              target: "showBooks",
              actions: ["cancelSave"],
            },
          },
        },
        saveBookInDB: {
          invoke: {
            src: "saveBookInDB",
            onDone: {
              target: "showBooks",
              actions: ["showSuccess"],
            },
            onError: {
              actions: ["showError"],
            },
          },
        },
      },
    },
    {
      actions: {
        openModal: assign((ct, e) => {
          return {
            ...ct,
            modalOpen: true,
          };
        }),
        saveBooks: assign((ct, e: any): any => {
          return {
            ...ct,
            books: [...e.data.books],
          };
        }),
        saveBook: assign((ct, e) => {
          return {
            ...ct,
            addedBook: { ...e },
            modalOpen: false,
          };
        }),
        showSuccess: assign((c, e) => {
          console.log("sucessssssss");

          return {
            ...c,
            showSuccess: true,
          };
        }),
        showError: assign((c, e) => {
          return {
            ...c,
            showError: true,
          };
        }),
        cancelSave: assign((ct, e) => {
          return {
            ...ct,
            addedBook: {},
            modalOpen: false,
          };
        }),
        reset: assign((ct, e) => {
          return {
            ...ct,
            showSuccess: false,
            showError: false,
          };
        }),
      },
      services: {
        saveBookInDB: (context, event): any => saveBookInDB(context.addedBook),
      },
    }
  );

const fetchAllBooks = (token: String, send: any) => {
  if (!token) {
    console.error("token not found....");
  } else {
    let reqBody;
    reqBody = {
      query: `
    query {
      books {
        _id,
        title,
        description,
        price,
        date,
        owner {
          _id
        }
      }
    }`,
    };
    return fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed.");
        } else {
          return res.json();
        }
      })
      .then((resData) => {
        send("saveBooks", { ...resData });
        return resData;
      })
      .catch((err) => console.error(err, " error"));
  }
};

const saveBookInDB = (data: any) => {
  const token = data.token;

  let reqBody;
  reqBody = {
    query: `
    mutation {
      createBook(bookInput: {
        title: "${data.title}",
        description: "${data.description}",
        price: ${parseFloat(data.price)}
        date: "${data.date}"
      }) {
        _id, title, description, date, price, owner { _id, email}
      }
    }`,
  };
  return fetch("http://localhost:3000/graphql", {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed.");
      } else {
        return res.json();
      }
    })
    .then((resData) => {
      console.log(resData, " reDa111111");
      return resData;
    })
    .catch((err) => console.error(err, " error"));
};

type BookProps = {
  token: String;
};

const Books: FC<BookProps> = ({ token }) => {
  const [current, send] = useMachine(booksMachine);
  console.log(current.context, " current context");
  let navigate = useNavigate();

  useEffect(() => {
    if (current.context.showSuccess) {
      window.alert("Book saved successfully");
      send("reset");
      navigate("/books");
    } else if (current.context.showError) {
      window.alert("Unable to save book, retry.");
      send("reset");
      navigate("/books");
    }
  }, [current.context]);

  const form = useForm({
    defaultValues: {
      title: "",
      price: "",
      date: "",
      description: "",
    },
  });
  const addBookHandler = () => {
    send("openModal");
  };

  const onCancelHandler = (e: any) => {
    send(e);
  };

  const showBooksHandler = () => {
    fetchAllBooks(token, send);
  };

  const onConfirmHandler = (e: any) => {
    const title = form.getValues("title");
    const description = form.getValues("description");
    const price = form.getValues("price");
    const date = form.getValues("date");

    const book = {
      title,
      description,
      price,
      date,
      token,
    };

    send(e, book);
    form.resetField("title");
    form.resetField("description");
    form.resetField("price");
    form.resetField("date");
  };

  const renderBooks = () => {
    const books = [...current.context.books];
    console.log(current.context, " current.context");
    const sortedBooks = books.reverse();

    const data = sortedBooks.map((book: any) => (
      <>
        <div key={book._id} className="book_wrapper">
          <div className="title_price_date">
            <div className="title">
              Title - <span className="fetchedDataText">{book.title}</span>
            </div>
            <hr className="hrInDetail" />
            <div>
              <div>Price - Date</div>
              <span className="fetchedDataText">
                ${book.price} - {new Date(book.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="description">
            <div> Description</div>
            <hr className="hrInDetail" />
            <div>
              <span className="fetchedDataText descriptiveText">
                {" "}
                {book.description}
              </span>
            </div>
          </div>
        </div>
      </>
    ));

    console.log(data, " data");

    return data;
  };

  return (
    <>
      {current.context.modalOpen && (
        <>
          <Backdrop />
          <Modal
            title="Add Book"
            canCancel={true}
            canConfirm={true}
            onCancel={onCancelHandler}
            onConfirm={onConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  {...form.register("title", {
                    validate: (value: string): any => {
                      if (value.length < 1) {
                        return "Enter a valid title.";
                      }
                    },
                  })}
                  type="text"
                  id="title"
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  {...form.register("price", {
                    validate: (value: string): any => {
                      if (value.length < 1) {
                        return "Enter a valid email.";
                      }
                    },
                  })}
                  type="number"
                  id="price"
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  {...form.register("date", {
                    validate: (value: string): any => {
                      if (value.length < 1) {
                        return "Enter a valid email.";
                      }
                    },
                  })}
                  type="date"
                  id="date"
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">description</label>
                <textarea
                  {...form.register("description", {
                    validate: (value: string): any => {
                      if (value.length < 1) {
                        return "Enter a valid email.";
                      }
                    },
                  })}
                  rows={4}
                  id="description"
                />
              </div>
            </form>
          </Modal>
        </>
      )}
      <div className="books-control">
        <p>Add your own Book</p>
        <button onClick={addBookHandler} className="addBookBtn">
          Add Book
        </button>
      </div>
      <div className="baseContainer">
        <hr className="hr" />
        <button onClick={showBooksHandler} className="showBookBtn">
          Show Books
        </button>
        <hr className="hr" />
        <div>{renderBooks()}</div>
      </div>
    </>
  );
};

export default Books;
