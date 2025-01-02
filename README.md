# SplitUp

**SplitUp** is a minimalist and mobile-friendly Next.js application designed to manage and track shared expenses within private groups. Ideal for roommates and friends, this app allows users to create groups, add expenses, and calculate the balance for each member to determine how much each person owes or is owed. Authentication and data storage are handled using Supabase.

## Features

- **Create and Join Groups:** Users can create private groups and invite others using unique IDs.
- **Add Expenses:** Track shared expenses by adding them to the group.
- **Balance Calculation:** Automatically calculates and displays the current balance for each member.
- **Mobile-Friendly Design:** Optimized for mobile devices with a minimalist interface.
- **Secure Authentication:** Secure login using Supabase Auth.

## Tech Stack

- **Frontend:** Next.js, TypeScript
- **Backend:** Supabase (Authentication and Database)
- **UI Components:** Shadcn UI
- **Styling:** Tailwind CSS

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/DeveloperAdityaa/SplitUp.git
    cd splitup
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up Supabase:

    - Go to the [Supabase Console](https://app.supabase.io/).
    - Create a new project.
    - Get your API keys and URL from the project settings.

4. Create a `.env.local` file in the root of your project and add your Supabase config:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

5. Initialize Supabase in your project:

    Create a file `supabase.js` in the root of your project and initialize Supabase:

    ```ts
    // supabase.js
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```

6. Configure Tailwind CSS:

    Install Tailwind CSS and initialize it:

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

    Update `tailwind.config.js`:

    ```js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

    Update `./styles/globals.css`:

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

7. Run the development server:

    ```bash
    npm run dev
    ```

## Usage

1. **Sign Up / Login:**
   - Users can sign up or log in using Supabase Auth.

2. **Create Group:**
   - Users can create a new group and share the unique ID with others.

3. **Join Group:**
   - Users can join an existing group using the unique ID.

4. **Add Expenses:**
   - Add expenses to the group and track who paid what.

5. **View Balances:**
   - View the current balance for each member to see who owes whom.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.