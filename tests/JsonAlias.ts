import test from 'ava';
import {JsonAlias, JsonClass, ObjectMapper} from '../src';

test('@JsonAlias on field', t => {
  class Book {
    name: string;

    @JsonAlias({values: ['bkcat', 'mybkcat']})
    category: string;

    constructor(name: string, category: string) {
      this.name = name;
      this.category = category;
    }
  }

  class Writer {
    id: number;
    name: string;

    @JsonClass({class: () => [Array, [Book]]})
    books: Book[] = [];

    constructor(id: number, name: string, books: Book[]) {
      this.id = id;
      this.name = name;
      this.books = books;
    }
  }

  const objectMapper = new ObjectMapper();
  const jsonData = `{
  "id": 1,
  "name": "Lorenzo",
  "books": [
    {
      "name": "Learning TypeScript",
      "bkcat": "Web Development"
    },
    {
      "name": "Learning Spring",
      "mybkcat": "Java"
    }
  ]
}
`;

  const writer = objectMapper.parse<Writer>(jsonData, {mainCreator: () => [Writer]});
  t.assert(writer instanceof Writer);
  t.not(writer.books, null);
  t.is(writer.books.length, 2);
  t.is(writer.books[0].category, 'Web Development');
  // @ts-ignore
  t.is(writer.books[0].bkcat, undefined);
  t.is(writer.books[1].category, 'Java');
  // @ts-ignore
  t.is(writer.books[1].mybkcat, undefined);
});

test('@JsonAlias on constructor parameter', t => {
  class Book {
    name: string;
    category: string;

    constructor(name: string, @JsonAlias({values: ['bkcat', 'mybkcat']}) category: string) {
      this.name = name;
      this.category = category;
    }
  }

  class Writer {
    id: number;
    name: string;

    @JsonClass({class: () => [Array, [Book]]})
    books: Book[] = [];

    constructor(id: number, name: string, books: Book[]) {
      this.id = id;
      this.name = name;
      this.books = books;
    }
  }

  const objectMapper = new ObjectMapper();
  const jsonData = `{
  "id": 1,
  "name": "Lorenzo",
  "books": [
    {
      "name": "Learning TypeScript",
      "bkcat": "Web Development"
    },
    {
      "name": "Learning Spring",
      "mybkcat": "Java"
    }
  ]
}
`;

  const writer = objectMapper.parse<Writer>(jsonData, {mainCreator: () => [Writer]});
  t.assert(writer instanceof Writer);
  t.not(writer.books, null);
  t.is(writer.books.length, 2);
  t.is(writer.books[0].category, 'Web Development');
  // @ts-ignore
  t.is(writer.books[0].bkcat, undefined);
  t.is(writer.books[1].category, 'Java');
  // @ts-ignore
  t.is(writer.books[1].mybkcat, undefined);
});