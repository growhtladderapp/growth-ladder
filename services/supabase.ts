
import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase Environment Variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types for database tables
export type DatabaseLogEntry = {
    id?: string;
    user_id: string;
    date: string;
    calories: number;
    distance_km: number;
    mood: number;
    weight: number;
    body_fat?: number;
    muscle_mass?: number;
    water_percent?: number;
    created_at?: string;
};

export type DatabaseProfile = {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    age?: number;
    weight?: number;
    height?: number;
    experience_level?: string;
    primary_goal?: string;
    days_available?: number;
    preferences?: any;
};

export type DatabaseCalendarEvent = {
    id: string;
    user_id: string;
    date: string;
    time: string;
    title: string;
    completed: boolean;
    notified?: boolean;
    created_at?: string;
};

export const saveWorkoutLog = async (entry: DatabaseLogEntry) => {
    const { data, error } = await supabase
        .from('daily_logs')
        .upsert(entry, { onConflict: 'user_id,date' })
        .select();

    if (error) {
        console.error('Error saving workout log to Supabase:', error);
        throw error;
    }
    return data;
};

export const getCalendarEvents = async (userId: string) => {
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching calendar events:', error);
        return [];
    }
    return data;
};

export const saveCalendarEvent = async (event: DatabaseCalendarEvent) => {
    const { data, error } = await supabase
        .from('calendar_events')
        .upsert(event)
        .select();

    if (error) {
        console.error('Error saving calendar event:', error);
        throw error;
    }
    return data;
};

export const deleteCalendarEvent = async (eventId: string, userId: string) => {
    const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error deleting calendar event:', error);
        throw error;
    }
};

export const uploadAvatar = async (file: File, userId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
};
