# useStorageListener 👨🏾‍🎤👩🏾‍🎤🧑🏾‍🎤

## Installation
Sometimes we need to be able to detect changes in our localSotrage independently from the .* file we have made the modification, useStorageListener provides a dynamic way to listen for keys that are modified in the local storage in a simple and fast way, either using the listener effect or the state handler. 

> note: The listener effect can listen to other events that are not related to the localStorage, simply specify the name of the event to listen to 🧐

###### `(i) new auto type transformation 1.1.0` 🧩
----------
### Using npm or yarn:

```js script 
$ npm i use-storage-listener
$ yarn add use-storage-listener

```

### Simple use - useStorageListener:
```js script
import useStorageListener, { setStorage } from 'use-storage-listener';

function Test() {
 const [value, setValue] = useState(null)
 
  useStorageListener(({ key, value}) => {
    setValue(value)
  }, ['rememberMe'])

  const set = (remember) => {
    setStorage('rememberMe', remember);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>{value}</h1>
        <button onClick={() => set('nice work!')}>ONCLICK</button>
      </header>
    </div>
  );
}

```
### Simple use - useLocalStorage:
```js script
import { useLocalStorage } from 'use-storage-listener';

function Test() {
 const {state, setState} = useLocalStorage('rememberMe');
 
  return (
    <div className="App">
      <header className="App-header">
        <h1>{state}</h1>
        <button onClick={() => setState('simple work!')}>ONCLICK</button>
      </header>
    </div>
  );
}

```
### Hooks:

| name          | Params                                              |
| ------------- |:---------------------------------------------------:|
| useLocalStorage    | **callback:** void  **dependencies:** string[] | 
| useStorageListener | **key:** string                                |


### Options:

| Option        | Params                                   | Description  |
| ------------- |:----------------------------------------:| ------------:|
| setStorage    | **key:** string  **arg:** any         | when it receives a key and a value, it will add these to the store, or update the value if the key already exists **(triggers useStorageListener)**|
| removeStorage | **key:** string                          | deletes the key whose name it receives as a parameter from storage **(triggers useStorageListener)**     |
| getStorage    | **key:** string                          | when passed a key name, will return that key's value, or null if the key does not exist, in the given Storage object |
| clearStorage  | **callEventKey?:** string                | deletes the key whose name it receives as a parameter from storage  **(Activates useStorageListener** if callEventKey is provided**)**   |

