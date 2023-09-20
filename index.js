require('dotenv').config()
const { Octokit } = require('@octokit/core');
const githubToken = process.env.GH_TOKEN;
if (!githubToken) { return process.exit(2); } // check if token is missing

const octokit = new Octokit({ auth: githubToken });
(async () => {
  let { data } = await octokit.request('GET /repos/sandiegocs/add-to-gh/issues?filter=all');
  for (let issue of data) {
    const { data: {id} } = await octokit.request(`/users/${issue.user.login}`);
    const { status } = await octokit.request('POST /orgs/sandiegocs/invitations', {
        invitee_id: id
    });
    switch (status) {
      case 201:
        console.info(`Invited ${issue.user.login}`);
        break;
      default:
        console.error(status);
        console.error(`Failed to invite ${issue.user.login}`);
        process.exit(1); // non-zero exit since it fails.
    }
  }
})();
