# Troglodyte Angels

Web Audio synthesis for [Clara Iannotta](http://claraiannotta.com/)’s *Troglodyte Angels Clank By*.

The current performance version can be found at <http://claraiannotta.com/tacb/>

## Installation for Development

Clone the repository:
```bash
git clone git@github.com:delucis/troglodyte-angels.git
```

Install dependencies:    
```bash
cd troglodyte-angels
npm install
```

Serve the app locally & watch for changes:    
```bash
grunt
```

Navigate to <http://localhost:4000>    
```bash
open http://localhost:4000/
```

## Building for Deployment

The following will compile the necessary files for deployment to the subfolder `/tacb`:
```bash
grunt build
```
