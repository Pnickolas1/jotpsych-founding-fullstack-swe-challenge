THIS IS THE MOST IMPORTANT FILE IN THE ENTIRE REPO! HUMAN WRITING ONLY! NO AI ALLOWED!

### pulled repo and got started @ appx 8:58 AM central time Saturday, 3/1/25

### warning - this is stream on concious coding, their will be typos, random thoughts and ideas that sound good that will likely end up being terrible ideas

### also, some ideas might be good, qaulity but I won't implement and will bail on for interest of feature completeness and ship-ability.

## after the time alotted was complete, I cirlced back and put more thought into this and gave better explanations why I made the choices I did.

- um looks like tailwind isnt setup, not sure if thats intentional, either way, fixing it.

- UI improvements I would make and consider for the application, or any applications I work on:
  - layout shift, handling layout shift when components mount/unmount adds a lot UX shine, gives the product a better feel. 1 component never ideally impacts the placement of it's childen/sibling components unless there is a smooth transition

## Thoughts while completing tasks in README.md

Order of items I worked on:

- I ran out of time on early 5 work
  1 > 2 > 3 > 6 > 5 > 4

1. Recording State bug

- fixing the recorder component; opting to use refs, using it as a counter that remains stable between renders; I am sure there is another way, but sticking w/ basic react patterns
- Was the 5 constant a trick?

2. Loading State:

- Used a skelton instead of a spinner, skeletons allow for better UX and the lets you set space for text to fall gracefully and guard against dramatic layout shifts.
- also, we should force the users to wait and not click into another recording flow while we have a transcription working, for now. Ideally a user would be able to opt out whenever, but being more strict in the interests of time.
- right now, no error state, added that, it's not in the directions, but just throwing it in there as a TODO UI component, the red and colors were now showing up, I think there is something incorrect w/ the Tailwind CSS setup
  - not enought time to really dig into the setup problems

3. Version Compatitbility System:

- not sure if I fully understand this, but going w/ my assumptions that may be incorrect;
- created a modal for the client to handle if versions are out of sync; again Tailwind was being a pain, the modal did not have a modal effect, dropped down to raw `style` tag on jsx, anti-pattern, but effective.
  - you have to "Hard code" the versions mismatched for right now
    - either in APISERVICE or the App.py, set a version mismatch and the component <VersionManager> should render
    - also dropped down to raw js and browser event handlers to catch the event emitted by the server for a version mismatch event,
      - I could have put that into a `useEffect` just did not, bc of time.
- the modal was acting weird, I thnk I ran into some issues w/ tailwind, Ideally I think this is a toast that pops in right corner, users modify from there.

## this is when I started running out of time and picking/choosing value/time constaints:

4. Parallel Procession

- just aborted this bc I haven't done this in awhile, would need to read up and
- time/value/completeness would suffer, choose to do other things

5. User Identiy

- I wanted to start working on this but ran out of time at the end, I had everything setup for this
- I would have a put a hook on the client to store `userProfile` and manage the state/localStorage syncing from a hook within a context manager
  - Why? Bc then other users get all needed information anywhere in the application with something ` const { user } = useProfile()`
    - user id, profile info, etc

6. Transcription Categorization - PLEASE ADD OPEN_AI_API_KEY=

## You must add OPEN_AI_API_KEY in app.py

- I Know this should live in a .env file, no time, had to smash work in.
- I put this is in, only openai, I did not use anthropic bc I ran out time
- I was digging through the openAI API docs, I know there is sturcture_response format, I can I use something like "zod" with node, but I could not find the analogous libs for python
- it works there is some superflous information, and Id like to clean up the prompt to be more refined, but thats time I did not have
- used turbo models to be faster, classification jobs like this do not need the frontier models, speeed > reasoning here

ugh;
ran into some problems;
anyays

All the best guys!
