import { db } from "./setup";
import {
  get,
  onValue,
  push,
  ref,
  update,
  remove,
  set,
} from "firebase/database";

export const readOnValue = (
  path,
  callBackSuccess,
  callBackError,
  args = {}
)=>{
  let result = {};
  const reference = ref(db, path);
  onValue(reference, (snapshot) => {
    if (snapshot.exists()) {
      result = callBackSuccess
        ? callBackSuccess(snapshot.val(), args)
        : snapshot.val();
    }
  });
  return result;
};

export function readOnceGet(path, callBackSuccess, callBackError, args = {}) {
  const reference = ref(db, path);
  return get(reference, args)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return callBackSuccess
          ? callBackSuccess(snapshot.val(), args)
          : snapshot.val();
      }
    })
    .catch((error) => {
      return callBackError ? callBackError(error) : error;
    });
}

export const readOnceObserve = (
  path,
  callBackSuccess,
  callBackError,
  args = {}
) => {
  const reference = ref(db, path);
  return onValue(
    reference,
    (snapshot) => {
      callBackSuccess ? callBackSuccess(snapshot.val(), args) : snapshot.val();
    },
    {
      onlyOnce: true,
    }
  );
};

export const write = (
  path,
  data,
  callBackSuccess,
  callBackError,
  args = {}
) => {
  const reference = ref(db, path);
  set(reference, data)
    .then((value) => {
      callBackSuccess && callBackSuccess(data, args);
    })
    .catch((error) => {
      callBackError && callBackError(error);
    });
};

export const writeAsync = (
  path,
  data,
  callBackSuccess,
  callBackError,
  args = {}
) => {
  const reference = ref(db, path);
  let key = push(reference);
  set(key, data)
    .then((value) => {
      callBackSuccess && callBackSuccess(data, args);
    })
    .catch((error) => {
      callBackError && callBackError(error);
    });
};

export const updateAsync = (
  path,
  data,
  callBackSuccess,
  callBackError,
  args = {}
) => {
  const reference = ref(db, path);

  return update(reference, data)
    .then((value) => {
      return callBackSuccess && callBackSuccess(data, args);
    })
    .catch((error) => {
      return callBackError && callBackError(error);
    });
};

export const removeAsync = (
  path,
  callBackSuccess,
  callBackError,
  args = {}
) => {
  const reference = ref(db, path);
  remove(reference)
    .then((v) => {
      return callBackSuccess && callBackSuccess(v, args);
    })
    .catch((error) => {
      return callBackError && callBackError(error);
    });
};
