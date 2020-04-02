import test from 'ava';
import {JsonGetter} from '../src/annotations/JsonGetter';
import {JsonSetter} from '../src/annotations/JsonSetter';
import {JsonClass} from '../src/annotations/JsonClass';
import {ObjectMapper} from '../src/databind/ObjectMapper';
import {JsonIgnoreProperties} from '../src/annotations/JsonIgnoreProperties';

test('@JsonIgnoreProperties', t => {
  class User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;

    @JsonClass({class: () => [Array, [Item]]})
    items: Item[] = [];

    constructor(id: number, email: string, firstname: string, lastname: string) {
      this.id = id;
      this.email = email;
      this.firstname = firstname;
      this.lastname = lastname;
    }
  }

  @JsonIgnoreProperties({
    value: ['owner']
  })
  class Item {
    id: number;
    name: string;
    category: string;

    @JsonClass({class: () => [User]})
    owner: User;

    constructor(id: number, name: string, category: string, owner: User) {
      this.id = id;
      this.name = name;
      this.category = category;
      this.owner = owner;
    }
  }

  const user = new User(1, 'john.alfa@gmail.com', 'John', 'Alfa');
  const item1 = new Item(1, 'Game Of Thrones', 'Book', user);
  const item2 = new Item(2, 'NVIDIA', 'Graphic Card', user);
  user.items.push(...[item1, item2]);

  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  // eslint-disable-next-line max-len
  t.is(jsonData, '{"id":1,"email":"john.alfa@gmail.com","firstname":"John","lastname":"Alfa","items":[{"id":1,"name":"Game Of Thrones","category":"Book"},{"id":2,"name":"NVIDIA","category":"Graphic Card"}]}');

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.is(userParsed.id, 1);
  t.is(userParsed.email, 'john.alfa@gmail.com');
  t.is(userParsed.firstname, 'John');
  t.is(userParsed.lastname, 'Alfa');
  t.is(userParsed.items.length, 2);
  t.is(userParsed.items[0].id, 1);
  t.is(userParsed.items[0].name, 'Game Of Thrones');
  t.is(userParsed.items[0].category, 'Book');
  t.is(userParsed.items[0].owner, null);
  t.is(userParsed.items[1].id, 2);
  t.is(userParsed.items[1].name, 'NVIDIA');
  t.is(userParsed.items[1].category, 'Graphic Card');
  t.is(userParsed.items[1].owner, null);
});

test('@JsonIgnoreProperties with @JsonGetter and @JsonSetter', t => {
  @JsonIgnoreProperties({value: ['fullname']})
  class User {
    id: number;
    firstname: string;
    lastname: string;
    fullname: string[];

    constructor(id: number, firstname: string, lastname: string) {
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
    }

    @JsonGetter({value: 'fullname'})
    getFullname(): string {
      return this.firstname + ' ' + this.lastname;
    }

    @JsonSetter({value: 'fullname'})
    setFullname(fullname: string): string[] {
      return fullname.split(' ');
    }
  }

  const user = new User(1, 'John', 'Alfa');
  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  t.is(jsonData, '{"id":1,"firstname":"John","lastname":"Alfa"}');

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.is(userParsed.id, 1);
  t.is(userParsed.firstname, 'John');
  t.is(userParsed.lastname, 'Alfa');
  t.is(userParsed.fullname, undefined);
});

test('@JsonIgnoreProperties with allowGetters "true"', t => {
  @JsonIgnoreProperties({value: ['fullname', 'firstname'], allowGetters: true})
  class User {
    id: number;
    firstname: string;
    lastname: string;
    fullname: string[];

    constructor(id: number, firstname: string, lastname: string) {
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
    }

    @JsonGetter({value: 'fullname'})
    getFullname(): string {
      return this.firstname + ' ' + this.lastname;
    }

    @JsonSetter({value: 'fullname'})
    setFullname(fullname: string): string[] {
      return fullname.split(' ');
    }
  }

  const user = new User(1, 'John', 'Alfa');
  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  t.is(jsonData, '{"id":1,"lastname":"Alfa","fullname":"John Alfa"}');

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.is(userParsed.id, 1);
  t.is(userParsed.firstname, null);
  t.is(userParsed.lastname, 'Alfa');
  t.is(userParsed.fullname, undefined);
});

test('@JsonIgnoreProperties with allowSetters "true"', t => {
  @JsonIgnoreProperties({value: ['fullname', 'firstname'], allowGetters: true, allowSetters: true})
  class User {
    id: number;
    firstname: string;
    lastname: string;
    fullname: string[];

    constructor(id: number, firstname: string, lastname: string) {
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
    }

    @JsonGetter({value: 'fullname'})
    getFullname(): string {
      return this.firstname + ' ' + this.lastname;
    }

    @JsonSetter({value: 'fullname'})
    setFullname(fullname: string): string[] {
      return fullname.split(' ');
    }
  }

  const user = new User(1, 'John', 'Alfa');
  const objectMapper = new ObjectMapper();

  const jsonData = objectMapper.stringify<User>(user);
  t.is(jsonData, '{"id":1,"lastname":"Alfa","fullname":"John Alfa"}');

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.is(userParsed.id, 1);
  t.is(userParsed.firstname, null);
  t.is(userParsed.lastname, 'Alfa');
  t.deepEqual(userParsed.fullname, ['John', 'Alfa']);
});

test('@JsonIgnoreProperties with ignoreUnknown "true"', t => {
  @JsonIgnoreProperties({value: ['firstname'], ignoreUnknown: true})
  class User {
    id: number;
    firstname: string;
    lastname: string;

    constructor(id: number, firstname: string, lastname: string) {
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
    }
  }

  const objectMapper = new ObjectMapper();
  const jsonData = '{"id":1,"firstname":"John","lastname":"Alfa","email":"john.alfa@gmail.com"}';

  const userParsed = objectMapper.parse<User>(jsonData, {mainCreator: () => [User]});
  t.assert(userParsed instanceof User);
  t.is(userParsed.id, 1);
  t.is(userParsed.firstname, null);
  t.is(userParsed.lastname, 'Alfa');
  t.assert(!Object.hasOwnProperty.call(userParsed, 'email'));
});
