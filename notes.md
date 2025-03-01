THIS IS THE MOST IMPORTANT FILE IN THE ENTIRE REPO! HUMAN WRITING ONLY! NO AI ALLOWED!

### pulled repo and got started @ appx 8:58 AM central time Saturday, 3/1/25

### warning - this is stream on concious coding, their will be typos, random thoughts and ideas that sound good that will likely end up being terrible ideas

### also, some ideas might be good, qaulity but I won't implement and will bail on for interest of feature completeness and ship-ability.

- um looks like tailwind isnt setup, not sure if thats intentional, either way, fixing it.

- UI improvements I would make and consider for the application, or any applications I work on:
  - layout shift, handling layout shift when components mount/unmount adds a lot UX shine, gives the product a better feel. 1 component never ideally impacts the placement of it's childen/sibling components unless there is a smooth transition

## Thoughts while completing tasks in README.md

1. Recording State bug

- fixing the recorder component; opting to use refs, using it as a counter that remains stable between renders; I am sure there is another way, but sticking w/ basic react patterns

2. Loading State:

- Used a skelton instead of a spinner, skeletons allow for better UX and the lets you set space for text to fall gracefully and protext against layout shift.

3. Version Compatitbility System:

- not sure if I fully understand this, but going w/ my assumptions that may be incorrect;
- created a modal for the client to handle if versions are out of sync
- the modal was not modaling, I need to put it in a react portal, otherwise Id build a vanilla modal

ugh;
ran into some problems;
tried to fix this classification bug
