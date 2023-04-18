/**
 * Produce Promise during for "no less than pointed time".
 * If Promise takes more than pointed time: no additional waiting
 * If Promise resolves or rejects in less than pointed time: waiting for pointed time
 * @param promise Promise that we must wait for pointed time
 * @param ms min time that Promise must take
 */
export default function promiseWait(promise: Promise, ms = 300) {
  let catchErr: unknown;
  return new Promise((resolve, reject) => {
    setTimeout(() => (catchErr ? reject(catchErr) : resolve(promise)), ms);
    promise.catch((err) => {
      catchErr = err;
      return err;
    });
  });
}
