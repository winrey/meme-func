export function getClassName(obj: Object) {
  if (obj && obj.constructor && obj.constructor.toString()) {
    if(obj.constructor.name) {
      return obj.constructor.name;
    }
    let str = obj.constructor.toString();
    let arr;
    if(str.charAt(0) == '[')
    {
      arr = str.match(/\w+\s∗(\w+)\w+\s∗(\w+)/);
    } else {
      arr = str.match(/function\s*(\w+)/);
    }
    if (arr && arr.length == 2) {
      return arr[1];
    }
  }
  return undefined; 
}
