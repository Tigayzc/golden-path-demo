# Problems Data

This directory contains the data for the "Problems While Developing" page.

## File Structure

- `problems.json` - Contains all development problems and their solutions

## Adding New Problems

To add a new problem, edit `problems.json` and add a new object to the array:

```json
{
  "id": 4,
  "title": "Your Problem Title",
  "date": "2026-02-06",
  "category": "CI/CD | Security | Infrastructure | Frontend | Backend",
  "description": "Detailed description of the problem you encountered.",
  "solution": "How you solved the problem.",
  "status": "resolved | ongoing"
}
```

### Field Descriptions

- **id** (number, required): Unique identifier, increment from the last ID
- **title** (string, required): Short, descriptive title of the problem
- **date** (string, required): Date in YYYY-MM-DD format
- **category** (string, required): Problem category
  - Common categories: `CI/CD`, `Security`, `Infrastructure`, `Frontend`, `Backend`, `Testing`, `Deployment`
- **description** (string, required): Detailed explanation of the problem
- **solution** (string, required): How the problem was solved
- **status** (string, required): Current status
  - `resolved` - Problem has been fixed (shows green checkmark)
  - `ongoing` - Problem is still being worked on (shows orange warning)

## Example

```json
{
  "id": 4,
  "title": "React Router 404 on Direct URL Access",
  "date": "2026-02-06",
  "category": "Frontend",
  "description": "Accessing /problems directly resulted in 404 error because Cloudflare Pages didn't know to serve index.html for all routes.",
  "solution": "Added /* /index.html 200 rule to public/_redirects file to enable SPA routing.",
  "status": "resolved"
}
```

## Tips

1. **Be specific**: Write clear descriptions that help others understand the context
2. **Include root cause**: Explain why the problem occurred
3. **Document the fix**: Provide enough detail for someone to apply the same solution
4. **Update status**: Change status to "resolved" when fixed
5. **Use proper dates**: Use the date when the problem was first encountered
6. **Categorize correctly**: Choose the most relevant category

## Categories Guide

- **CI/CD**: GitHub Actions, deployment pipelines, build processes
- **Security**: Gitleaks, Trivy, authentication, secrets management
- **Infrastructure**: Terraform, DNS, Cloudflare configuration
- **Frontend**: React, routing, UI/UX issues
- **Backend**: API issues, server-side logic
- **Testing**: Unit tests, integration tests, test failures
- **Deployment**: Cloudflare Pages deployment issues
