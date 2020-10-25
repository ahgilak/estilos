function createState(
  defaultState = {},
  element: string | HTMLElement = document.documentElement,
) {
  var _element: HTMLElement;

  if (typeof element == "string") {
    const __element = document.querySelector(element) as HTMLElement;
    if (!__element) {
      throw new Error(`"${element}" selector does not match any element.`);
    } else {
      _element = __element;
    }
  } else {
    _element = element;
  }

  const getVar = (property: string) =>
    getComputedStyle(_element).getPropertyValue($get(property));
  const setVar = (property: string, value: string) =>
    _element.style.setProperty($get(property), value);

  const state = new Proxy(
    () => {},
    {
      get(target: Function, property: string) {
        return getVar(property);
      },

      set(target: Function, property: string, value: string) {
        setVar(property, value);
        return true;
      },

      apply(
        target: Function,
        thisArg: any,
        [object]: [{ [key: string]: string }],
      ) {
        for (let property in object) {
          setVar(property, object[property]);
        }
        return true;
      },
    },
  );

  state(defaultState);

  return state;
}

function $get(property: string) {
  return "--" + property.replace(/[A-Z]/g, (s) => "-" + s.toLowerCase());
}

function $var(property: string) {
  return `var(${$get(property)})`;
}

function addQuotes(text: string) {
  return `"${text}"`;
}

function removeQuotes(text: string) {
  let matches = text.match(/(["'])(?:(?=(\\?))\2.)*?\1/);

  if (matches?.length) {
    return matches[0].slice(1, -1);
  }

  return text;
}

export { createState, $get, $var, addQuotes, removeQuotes };
