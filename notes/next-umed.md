NEXT

---

- mediator make resolvers simpler:

"maybe theres a way to fix up the problems we have on electron side and my complaints too about mediator being too hard to manage
what if
you dont need to do this
instead whenever you call `resolveCommand()`
it will automatically register it with mediator
we just have to assume that theres only one mediator per process which i think is right
that would save us a lot of typing
and would also let me put command resolvers into the react tree"

Queryable:

1. Make Slack API accessible we can do CRUD actions on
2. Make Gmail, Github as well
3. THEN do postgres (since its new) (with docker image to test internally)

Umed, your long term goal is basically to get a bunch of integrations really nicely working, as consistently as possible. Just go one at a time and we can discuss as we go.

Here's a great reference for them:

https://tryretool.com/integrations

---

Integrations ordered priority:

1. Postgres
2. Current Integrations READ/WRITE simple api
   1. (slack, gmail, github for read/write, the rest just read)
3. Google Sheets read/write
4. MySQL, Redshift
5. S3
6. Stripe
7. Twilio
8. Firebase
