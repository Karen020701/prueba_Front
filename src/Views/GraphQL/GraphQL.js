import React, { useState } from 'react';
import './styles.css';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from "react-router-dom";

// Consulta GraphQL para obtener todas las películas
const GET_BOOKS = gql`
  query {
    books {
      id
      title
      autor
      year
      coverImage
    }
  }
`;

// Mutación GraphQL para agregar un libro
const ADD_BOOK = gql`
  mutation AddBook($title: String!, $autor: String!, $year: Int!, $coverImage: String) {
    addBook(title: $title, autor: $director, year: $year, coverImage: $coverImage) {
      id
      title
      autor
      year
      coverImage
    }
  }
`;

// Mutación GraphQL para actualizar un libro
const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String!, $autor: String!, $year: Int!, $coverImage: String) {
    updateBook(id: $id, title: $title, autor: $autor, year: $year, coverImage: $coverImage) {
      id
      title
      autor
      year
      coverImage
    }
  }
`;

// Mutación GraphQL para eliminar un libro
const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

function GraphQL() {
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        autor: '',
        year: '',
        coverImage: ''
    });

    const { loading, error, data } = useQuery(GET_BOOKS);
    const [addBook] = useMutation(ADD_BOOK, {
        update(cache, { data: { addBook } }) {
            const { books } = cache.readQuery({ query: GET_BOOKS });
            cache.writeQuery({
                query: GET_BOOKS,
                data: { books: [...books, addBook] },
            });
        }
    });

    const [updateBook] = useMutation(UPDATE_BOOK, {
        update(cache, { data: { updateBook } }) {
            const { books } = cache.readQuery({ query: GET_BOOKS });
            cache.writeQuery({
                query: GET_BOOKS,
                data: { books: books.map(book => book.id === updateBook.id ? updateBook : book) },
            });
        }
    });

    const [deleteBook] = useMutation(DELETE_BOOK, {
        update(cache, { data: { deleteBook } }) {
            const { books } = cache.readQuery({ query: GET_BOOKS });
            cache.writeQuery({
                query: GET_BOOKS,
                data: { books: books.filter(book => book.id !== deleteBook.id) },
            });
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveBook = async () => {
        try {
            if (formData.id) {
                await updateBook({ variables: { ...formData, year: parseInt(formData.year) } });
            } else {
                await addBook({ variables: { ...formData, year: parseInt(formData.year) } });
            }
            setFormData({
                id: null,
                title: '',
                autor: '',
                year: '',
                coverImage: ''
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDeleteBook = async (id) => {
        try {
            await deleteBook({ variables: { id } });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleStartEditing = (book) => {
        setFormData({ ...book, year: book.year.toString() });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h1>Libros</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <h2>Agregar/Editar Libro</h2>
            <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleInputChange} />
            <input type="text" name="autor" placeholder="Autor" value={formData.autor} onChange={handleInputChange} />
            <input type="text" name="year" placeholder="Año" value={formData.year} onChange={handleInputChange} />
            <input type="text" name="coverImage" placeholder="URL de la imagen de portada" value={formData.coverImage} onChange={handleInputChange} />
            <button onClick={handleSaveBook}>Guardar</button>

            <h2>Libros existentes</h2>
            <ul>
                {data.books.map(book => (
                    <li key={book.id}>
                        <h3>{book.title}</h3>
                        <p><strong>Autor:</strong> {book.autor}</p>
                        <p><strong>Año:</strong> {book.year}</p>
                        <img src={book.coverImage} alt={book.title} style={{ maxWidth: '200px' }} />
                        <button className="edit" onClick={() => handleStartEditing(book)}>Editar</button>
                        <button className="delete" onClick={() => handleDeleteBook(book.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <div className="button-container">
                <Link to="/">
                    <button className="styled-button">Inicio</button>
                </Link>
            </div>
        </div>
    );
}

export default GraphQL;
