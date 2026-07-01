import { defineAbility, Ability } from '@casl/ability';
import { Role } from '../types';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'all' | 'Course' | 'Grade' | 'Schedule' | 'Finance' | 'User';

export function defineRulesFor(role: Role) {
  return defineAbility((can, cannot) => {
    if (role === 'admin') {
      can('manage', 'all');
    } else if (role === 'lecturer') {
      can('read', 'all');
      can('update', 'Grade'); // Dosen can edit grades
      can('create', 'Course'); // Dosen can create course content
      cannot('update', 'Finance'); // Dosen cannot edit financial info
    } else if (role === 'kaprodi') {
      can('read', 'all');
      can('update', 'Course'); // Kaprodi approves/edits courses
      cannot('update', 'Finance');
    } else if (role === 'dekan') {
      can('read', 'all');
      can('update', 'Finance'); // Dekan monitors/approves budget loads
    } else {
      // default: student
      can('read', 'Course');
      can('read', 'Grade');
      can('read', 'Schedule');
      can('read', 'Finance');
      cannot('create', 'Course');
      cannot('update', 'Grade'); // Student cannot modify grades!
      cannot('update', 'Finance'); // Student cannot alter tuition fees
    }
  });
}
