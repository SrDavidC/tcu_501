export function CharacterSP(name, description, audio, filename) {
  this.name = name;
  this.description = description;
  this.audio = audio;
  this.filename = filename;
}

CharacterSP.prototype.playAudio = function () {
  return new Promise( (resolve, reject) => {
    let characterAudio = new Audio(this.audio);
    characterAudio.addEventListener('ended', () =>{
      resolve();
    });

    characterAudio.addEventListener('error', (error) =>{
      reject(error);
    });
    characterAudio.play();
  });
};

