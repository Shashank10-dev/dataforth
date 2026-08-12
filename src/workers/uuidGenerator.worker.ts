self.onmessage = (e: MessageEvent<{ quantity: number, uppercase: boolean, removeHyphens: boolean }>) => {
  const { quantity, uppercase, removeHyphens } = e.data;
  
  const uuids = new Array(quantity);
  
  for (let i = 0; i < quantity; i++) {
    let uuid = self.crypto.randomUUID();
    
    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    
    if (removeHyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    
    uuids[i] = uuid;
  }
  
  self.postMessage({ uuids });
};
